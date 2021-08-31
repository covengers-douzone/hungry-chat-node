const models = require('../models');
const redis = require('redis');
const client = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT })
const pubClient = client.duplicate();
const moment = require('moment');
const {Op} = require('sequelize');
const fs = require('fs');
const {user} = require("../redis-conf");

module.exports = {
    getUserByNo: async (req,res) => {
            try{
                const result = await models.User.findOne({
                    where: {
                        no: req.params.userNo
                    }
                })

                console.log(result.profileImageUrl);
                console.log(result.nickname);

                const data = {
                    profileImageUrl:result.profileImageUrl,
                    nickname:result.nickname
                }

            res
                .status(200)
                .send({
                    result: 'success',
                    data: data,
                    message: null
                });
        } catch (err){
            console.error(`Fetch-Api : getUserByNo Error : ${err.status} ${err.message}`);
        }
    },
    updateSettings: async (req,res) => {
        try{
            const { file, body: {nickname, password, userNo}} = req;
            console.log(file);
            console.log(file.path);
            console.log(nickname);
            console.log(password);
            if(!file) {
                throw new Error('error: no file attached');
            }

            if(password === "null"){
                await models.User.update({
                    profileImageUrl: `http://localhost:9999/assets/images/${file.filename}`,
                    nickname: nickname,
                },{
                    where:{
                        no:userNo
                    }
                })
            } else {
                await models.User.update({
                    profileImageUrl: file.path,
                    nickname: nickname,
                    password: password,
                },{
                    where:{
                        no:userNo
                    }
                })
            }
            res
                .status(200)
                .send({
                    result: 'success',
                    data: file.filename,
                    message: null
                });
        } catch (err){
            console.error(`Fetch-Api : getNickname Error : ${err.status} ${err.message}`);
        }
    },
    getRoomList: async (req,res,next) => {
        try{
            const userNo = req.params.userNo;
            const results = await models.Room.findAll({
                include: [
                    {
                        model: models.Participant, as: 'Participants', required: true
                        , where: {
                            [`$Participants.userNo$`]: userNo
                        }
                    }
                ]
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
            const roomNo = req.body.roomNo;
            const participantNo = req.body.participantNo;
            const contents = req.body.contents;
            const type = "TEXT"
            const notReadCount = req.body.headCount;
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
                    }
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
    }
}
