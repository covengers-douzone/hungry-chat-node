const models = require('../models');
const redis = require('redis');
const client = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT })
const pubClient = client.duplicate();
const moment = require('moment');
const {Op} = require('sequelize');
const fs = require('fs');
const {user} = require("../redis-conf");

module.exports = {
    getGhostRoom: async ()=>{
        try{
            const deleteList = [];

            const includeGhostRoom = (await models.Room.findAll({
                include: [
                    {
                        model: models.Participant, as: 'Participants', required: true
                        , where: {
                            [`$Participants.userNo$`]: 1
                        }
                    }
                ]
            })).map(room => {return room.no});

            const ghostRoom = await models.Room.findAll({
                include: [
                    {
                        model: models.Participant, as: 'Participants', required: true,
                        include: [
                            {
                                model: models.User, required: true
                                ,attributes: {
                                    exclude: ['password','token']
                                }
                            }
                        ]
                    }
                ],
                where: {
                    no:{
                        [Op.in]: includeGhostRoom
                    }
                }
            });

            ghostRoom.map(ghost => {
                if (ghost.type === "private") {
                    if ((ghost.Participants.length === (ghost.Participants.filter(participant => {
                        return participant.userNo === 1
                    })).length)) {
                        deleteList.push(ghost.no);
                    }
                }
            })

            if(deleteList.length===0){
                return false;
            }else{
                const result3 = await models.Chat.destroy({
                    where:{
                        roomNo:{
                            [Op.in]:deleteList
                        }
                    }
                })

                const result2 = await models.Participant.destroy({
                    where:{
                        roomNo:{
                            [Op.in]:deleteList
                        }
                    }
                })

                const result1 = await models.Room.destroy({
                    where:{
                        no:{
                            [Op.in]:deleteList
                        }
                    }
                })
                return true;
            }
        }catch (e) {
            console.error(e.message);
        }
    },
    // layer
    updateStatus: async(participantNo,status) => {
        try{
            const results = await models.Participant.update({
                status: status
            },{
                where: {
                    no: participantNo
                }
            });
            return results;
        } catch(err){
            console.error(err);
        }
    },
    updateRoomNotReadCount: async(participantNo) => {
        try{
            const participant = await models.Participant.findOne({
                where: {
                    no: participantNo
                }
            });
            const results = await models.Chat.update({
                notReadCount: models.sequelize.Sequelize.literal('notReadCount - 1')
            },{
                where: {
                    createdAt: {
                        [Op.gt]: participant.lastReadAt
                    },
                    roomNo: participant.roomNo
                }
            })

            return results;
        } catch(e){
            console.error(e);
        }
    },
    getLastReadNo: async(participantNo) => {
        try{
            const participant = await models.Participant.findOne({
                where:{
                    no: participantNo
                }
            });
            const results = await models.Chat.max('no',{
                where:{
                    roomNo : participant.roomNo,
                    createdAt: {
                        [Op.lt]: participant.lastReadAt
                    }
                }
            });
            return results;
        } catch(e){
            console.error(e);
        }
    },
    getLastReadNoCount: async(participantNo) => {
        try{
            const participant = await models.Participant.findByPk(participantNo);
            const results = await models.Chat.findAndCountAll({
                where:{
                    roomNo : participant.roomNo,
                    createdAt: {
                        [Op.lt]: participant.lastReadAt
                    }
                }
            });
            return results;
        } catch(e){
            console.error(e);
        }
    },
    getHeadCount : async(participantNo) => {
        try{
            const results = await models.Room.findOne({
                include: [
                    {
                        model: models.Participant, as: 'Participants', required: true
                        , where: {
                            [`$Participants.no$`]: participantNo
                        }
                    }
                ]
            });
            return results.headCount;
        } catch(e){
            next(e);
        }
    },
    getChatListCount: async (roomNo) => {
        try {
            const results = await models.Chat.findAndCountAll({
                include: [
                    {
                        model: models.Participant, as: 'Participant', required: true
                        , where: {
                            [`$Participant.roomNo$`]: roomNo
                        }
                    }
                ],
                order: [['no', 'ASC']],
            });
            return results;
        } catch (err) {
            console.error(err);
        }
    },
    getChatList: async (roomNo,limit,offset) => {
        try {
            const results = await models.Chat.findAll({
                include: [
                    {
                        model: models.Participant, as: 'Participant', required: true
                        , where: {
                            [`$Participant.roomNo$`]: roomNo
                        }
                    }
                ],
                order: [['no', 'ASC']],
                limit: Number(limit),
                offset: Number(offset)

            });
            return results;
        } catch (err) {
            console.error(err);
        }
    },
    updateLastReadAt: async(participantNo) => {
        try{
            const results = await models.Participant.update({
                lastReadAt: new Date().toString()
            },{
                where: {
                    no: participantNo
                }
            })
            return results;
        } catch(e){
            console.error(e);
        }
    },
    getRoomList: async (userNo) => {
        try {
            const roomList = (await models.Room.findAll({
                include: [
                    {
                        model: models.Participant, as: 'Participants', required: true
                        , where: {
                            [`$Participants.userNo$`]: userNo
                        }
                    }
                ]
            })).map(room => {
                return room.no
            });

            return roomList;
        } catch (err) {
            console.error(`Fetch-Api : getRoomList Error : ${err.status} ${err.message}`);
        }
    },
    updateHeadCount: async ({type, roomNo}) => {
        try {
            let results;
            if (type === "join") {
                results = await models.Room.update({
                    'headCount': models.sequelize.Sequelize.literal('headCount + 1')
                }, {
                    where: {
                        no: roomNo
                    }
                });
            } else if (type === "exit") {
                results = await models.Room.update({
                    'headCount': models.sequelize.Sequelize.literal('headCount - 1')
                }, {
                    where: {
                        no: roomNo
                    }
                });
            }
            return results;
        } catch (err) {
            console.error(`Fetch-Api : getRoomList Error : ${err.status} ${err.message}`);
        }
    },
    deleteUnknown: async ({userNo}) => {
        try {
            const Partcipant = await models.Participant.update({
                userNo: 1
            }, {
                where: {
                    userNo: userNo,
                }
            });

            const results = await models.User.destroy({
                where: {
                    no: userNo,
                }
            });

            return results;
        } catch (err) {
            console.error(`Fetch-Api : getRoomList Error : ${err.status} ${err.message}`);
        }
    },


    // X
    getOpenChatRoomList: async (req,res,next) => {
        try{
            const roomList = (await models.Room.findAll({
               where:{
                    type: "public"
               }
            })).map(room => {return room.no});

            const results = await models.Room.findAll({
                include: [
                    {
                        model: models.Participant, as: 'Participants', required: true,
                        include: [
                            {
                                model: models.User, required: true
                                ,attributes: {
                                    exclude: ['password','phoneNumber','token']
                                }
                            }
                        ]
                    }
                ],
                where: {
                    no:{
                        [Op.in]: roomList
                    }
                }
            });

            // console.log(results[0].Participants);
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (err){
            console.error(`Fetch-Api : getRoomList Error : ${err.status} ${err.message}`);
        }
    },
    getFollowerList: async(req ,res , next ) => {
        try{
            const UserNo = req.body.UserNo;
            let followerList = [];
            // ?????? ??????????????? ????????? + ?????? ?????? ????????? ?????????
            const lists = (await models.Friend.findAll({
                where: {
                    friendNo : UserNo
                }
            })).map(list => list.userNo);


            // ?????? ??????????????? ?????????
            const friendList = (await models.Friend.findAll({
                where: {
                    userNo : UserNo
                }
            })).map( friend => friend.friendNo );

            // ?????? ??????????????? ?????????
            lists.map((list, i) => {
                if(friendList[i] === undefined){
                    followerList.push(list);
                }
            });

            const results = await models.User.findAll({
                attributes: {
                    exclude: ['password','phoneNumber','token']
                },
                where:{
                    no:{
                        [Op.in]: followerList
                    }
                }
            });

            // for(let i=0; i < results.length; i++){
            //     results[i].password = "";
            //     results[i].phoneNumber = "";
            // }
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch(err){
            next(err);
        }
    },
    addFriend: async (req, res) => {
        try{
            // 1. ????????? ????????? ????????? ????????? ?????? ??? no??? ????????????.
            // 2. ????????? no??? friendNo???, req??? ????????? no??? userNo??? ?????? insert ??????.
            // 3. response
            const username = req.body.username // ????????? ????????? ?????? ??????.
            const userNo = req.body.userNo; // ?????????.

            // (1) ????????? ????????? ?????? ?????? ????????????
            const result = await models.User.findOne({
                attributes: {
                    exclude: ['password','phoneNumber','token']
                },
                where: {
                    username: username
                }
            })

            if(result === null){
                throw new Error('???????????? ???????????? ????????????. ?????? ??????????????????.');
            }

            await models.Friend.create({
                userNo:userNo,
                friendNo:result.no
            })

            res
                .status(200)
                .send({
                    result: 'success',
                    data: result,
                    message: null
                });
        }catch (e){
            console.log(e);
            res
                .status(400)
                .send({
                    result: 'fail',
                    data: null,
                    message: e.message
                });
        }
    },
    getUserByNo: async (req,res) => {
            try{
                const result = await models.User.findOne({
                    attributes: {
                        exclude: ['password','phoneNumber','token']
                    },
                    where: {
                        no: req.params.userNo
                    }
                })
            res
                .status(200)
                .send({
                    result: 'success',
                    data: result,
                    message: null
                });
        } catch (err){
            console.error(`Fetch-Api : getUserByNo Error : ${err.status} ${err.message}`);
        }
    },
    updateSettings: async (req,res) => {
        try{
            let { file, body: {nickname, password, userNo, comments}} = req;
            let fileUrl;

            const result = await models.User.findOne({
                attributes: {
                    exclude: ['phoneNumber','token']
                },
                where: {
                    no: userNo
                }
            })

            password = (password === "null" ? result.password : password);
            fileUrl = (file === undefined ? result.profileImageUrl :  process.env.URL+process.env.UPLOADIMAGE_STORE_LOCATION+file.filename)

            await models.User.update({
                profileImageUrl: fileUrl,
                comments: comments,
                nickname: nickname,
                password: password
            },{
                where:{
                    no:userNo
                }
            })
            res
                .status(200)
                .send({
                    result: 'success',
                    data: fileUrl,
                    message: null
                });
        } catch (err){
            console.error(`Fetch-Api : getNickname Error : ${err.status} ${err.message}`);
        }
    },


    getChat: async (req,res,next) => {
        try{
            const chatNo = req.params.chatNo;

            const results = await models.Chat.findOne({
                where: {
                    no: chatNo
                }
            });

            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch(e){
            next(e);
        }
    },

    send : async(req ,res , next ) => {
        try{
            const { file, body: {roomNo,participantNo,text,headCount:notReadCount}} = req;

            let contents;
            let type;
            if(!file){
                contents = text;
                type = "TEXT";
            } else if(file) {
                const fileType = file.mimetype.split('/')[0];
                if( fileType === 'video'){
                    type = "VIDEO"
                } else if(fileType === "image"){
                    type = "IMG"
                }
                contents = file.path;
            } 

            const results = await models.Chat.create({
                roomNo , type , contents , notReadCount , participantNo
            });
            await pubClient.publish(`${roomNo}`, `${roomNo}:${participantNo}:${results.no}:${contents}:${moment().format('h:mm a')}:${notReadCount}`)
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch(err){
            next(err);
        }
    },
    // UPDATE chat c
    //  INNER JOIN participant p
    //     ON c.participantNo = p.no -- c.roomNo = p.roomNo
    //    SET c.notReadCount =  c.notReadCount - 1
    //    where p.lastReadAt < c.createdAt
    //    AND p.no = 1
    //    ;

    updateSendNotReadCount: async(req ,res , next ) => {
        try{
            const chatNo = req.body.chatNo;
            const results = await models.Chat.update({
                'notReadCount': models.sequelize.Sequelize.literal('notReadCount - 1')
            },{
                where: {
                    no: chatNo
                }
            });
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch(e){
            next(e);
        }
    },
    createRoom : async(req ,res , next ) => {
        try{
            const title = req.body.title;
            const headCount = req.body.headCount;
            const type = req.body.type;
            const password = req.body.password;

            const results = await models.Room.create({
                title,password,type,headCount
            });
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results.no,
                    message: null
                });
        } catch(err){
            next(err);
        }
    },
    createParticipant : async(req ,res , next ) => {
        try{
            const role = req.body.role;
            const status = 0;
            const lastReadAt = new Date().toString();
            const roomNo = req.body.roomNo;
            const userNo = req.body.UserNo;
            const nickName = (await models.User.findOne({
                where: {
                    no: userNo
                }
            })).nickname;

            const results = await models.Participant.create({
                role , status , lastReadAt , roomNo ,userNo , nickName
            })
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch(err){
            next(err);
        }
    },

    /*
    *  SELECT * FROM Friend A , user B
    *  WHERE 1 = 1
    *  AND A.userNo = {}
    * */
    getFriendList: async(req ,res , next ) => {
        try{
            const UserNo = req.body.UserNo;
            const results = await models.User.findAll({
                include: [
                    {
                        model: models.Friend, as: 'Friends', required: true
                        , where: {
                            [`$Friends.userNo$`]: UserNo
                        }
                    }
                ],
            });

            for(let i=0; i < results.length; i++){
                results[i].password = "";
                results[i].phoneNumber = "";
            }

            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch(err){
            next(err);
        }
    },
    /*
       SELECT  min(A.no) FROM chat A , participant B
       WHERE 1 = 1
       AND A.participantNo = B.no
       AND A.roomNo = b.roomNo
       AND A.createdAt < B.LastReadAt
    * */
    getLastReadAt: async(req ,res , next ) => { // ????????? ?????? ????????? ?????????
        try{
            const ParticipantNo = req.body.ParticipantNo;

            const results = await models.Chat.findOne({
                attributes : ['no'],
                include : [
                    {
                        model: models.Participant, as: 'Participant',
                        attributes: ["no"]
                    }
                ]
            })
        } catch(err){
            next(err);
        }
    },



    //update Chat SET notReadCount = 0 where roomNo = 1
    updateChatZero: async(req ,res , next ) => {
        try{
            const roomNo = req.body.roomNo;
            const results = await models.Chat.update({
                notReadCount: 0
            },{
                where: {
                    roomNo: roomNo
                }
            });
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch(e){
            next(e);
        }
    }
}