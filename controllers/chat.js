const models = require('../models');
const redis = require('redis');
const client = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT })
const pubClient = client.duplicate();
const moment = require('moment');
const {Op} = require('sequelize');
const fs = require('fs');
const {user} = require("../redis-conf");

module.exports = {
    getFollowerList: async(req ,res , next ) => {
        try{
            const UserNo = req.body.UserNo;
            let followerList = [];
            // 나를 친구추가한 사람들 + 내가 친구 추가한 사람들
            const lists = (await models.Friend.findAll({
                where: {
                    friendNo : UserNo
                }
            })).map(list => list.userNo);


            // 내가 친구추가한 사람들
            const friendList = (await models.Friend.findAll({
                where: {
                    userNo : UserNo
                }
            })).map( friend => friend.friendNo );

            // 나를 친구추가한 사람들
            lists.map((list, i) => {
               if(friendList[i] === undefined){
                   followerList.push(list);
               }
            });

            const results = await models.User.findAll({
                where:{
                    no:{
                        [Op.in]: followerList
                    }
                }
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
    addFriend: async (req, res) => {
        try{
            // 1. 받아온 이메일 주소로 유저를 조회 및 no를 가져온다.
            // 2. 가져온 no를 friendNo로, req로 받아온 no를 userNo로 하여 insert 한다.
            // 3. response
            const username = req.body.username // 친구의 이메일 계정 정보.
            const userNo = req.body.userNo; // 사용자.

            // (1) 이메일 정보로 친구 정보 가져오기
            const result = await models.User.findOne({
                where: {
                    username: username
                }
            })

            if(result === null){
                throw new Error('이메일이 일치하지 않습니다. 다시 확인해주세요.');
            }

            result.password="";
            result.phoneNumber="";
            result.token="";

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
                    where: {
                        no: req.params.userNo
                    }
                })
                result.password = "";
                result.phoneNumber = "";
                result.token="";
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
                console.log("profile update All");

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
    getRoomList: async (req,res,next) => {
        try{
            const userNo = req.params.userNo;

            const roomList = (await models.Room.findAll({
                include: [
                    {
                        model: models.Participant, as: 'Participants', required: true
                        , where: {
                            [`$Participants.userNo$`]: userNo
                        }
                    }
                ]
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
    getChatList : async (req,res,next) => {
        try{
            const roomNo = req.params.roomNo;

            const results = await models.Chat.findAll({
                include: [
                    {
                        model: models.Participant, as: 'Participant', required: true
                        , where: {
                            [`$Participant.roomNo$`]: roomNo
                        }
                    }
                ],
                order: [['no','ASC']]
            });
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch(err){
            res
                .status(200)
                .send({
                    result: 'fail',
                    data: null,
                    message: "System Error"
                });
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
    getHeadCount : async(req ,res , next ) => {
        try{
            const headCount = await models.Room.findOne({
                    include: [
                        {
                            model: models.Participant, as: 'Participants', required: true
                            , where: {
                                [`$Participants.no$`]: req.body.participantNo
                            }
                        }
                    ]
                });
            res
                .status(200)
                .send({
                    result: 'success',
                    data: headCount.headCount,
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
            } else{
                contents = file.path;
                type = "IMG"
            }

            const results = await models.Chat.create({
                 roomNo , type , contents , notReadCount , participantNo
            });
            await pubClient.publish(`${roomNo}`, `${roomNo}:${participantNo}:${contents}:${moment().format('h:mm a')}:${notReadCount}:${results.no}`)
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
    updateRoomNotReadCount: async(req ,res , next ) => {
        try{
            const participantNo = req.body.participantNo;

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

            console.log(results);
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
    updateStatus: async(req ,res , next ) => {
            try{
                console.log(req.body);
                const ParticipantNo = req.body.ParticipantNo;
                const status = req.body.status;

                const results = await models.Participant.update({
                    status: status
                },{
                    where: {
                        no: ParticipantNo
                    }
                });
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
    getLastReadAt: async(req ,res , next ) => { // 마지막 읽은 시각을 찾는다
        try{
            console.log(req.body);
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
    updateLastReadAt: async(req ,res , next ) => {
        try{
            const participantNo = req.body.participantNo;
            const results = await models.Participant.update({
                lastReadAt: new Date().toString()
            },{
                where: {
                    no: participantNo
                }
            })

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
    getLastReadNo: async(req ,res , next ) => {
        try{
            const participantNo = req.body.participantNo;
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
    },
    uploadFile: async(req ,res , next ) => {
        try{
            const { file, body: {}} = req;

            res
               .status(200)
               .send({
                   result: 'success',
                   data: file,
                   message: null
               });
        }catch(e){
            next(e);
        }
    }
}
