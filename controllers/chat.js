const models = require('../models');
const redis = require('redis');
const client = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT })
const pubClient = client.duplicate();
const moment = require('moment');

module.exports = {
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
            next(err);
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
            next(err);
        }
    },
    send : async(req ,res , next ) => {
        try{
            console.log("send" + req.body.toString());
            const roomNo = req.body.roomNo;
            const participantNo = req.body.participantNo;
            const contents = req.body.contents;
            const type = "TEXT"
            const notReadCount = 0;
            const results = await models.Chat.create({
                 roomNo , type , contents , notReadCount , participantNo
            });
            await pubClient.publish(`${roomNo}`, `${roomNo}:${participantNo}:${contents}:${moment().format('h:mm a')}:${0}`)
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
    create : async(req ,res , next ) => {
        try{
            // Room Table 관련
            const title = req.body.title;
            const password = "";
            const type = "public";

            // participant

            const role = "ROLE_HOST"
            const status = 1;
            const lastReadAt = new Date().toString();
            let roomNo = await models.Room.max('no')
            roomNo++;
            const userNo = req.body.UserNo;
            const nickName = "Townsend Sear";


            await models.Room.create({
                title,password,type
            });
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
            console.log("getFriendList" , UserNo);
            const results = await models.Friend.findAll({
                include: [
                    {
                        model: models.Friend, as: 'Friend', required: true
                        , where: {
                            [`$Friend.UserNo$`]: UserNo
                        }
                    }
                ],
            });
        } catch(err){
            next(err);
        }
    },
    /* UPDATE CHAT SET notReadCount = notReadCount - 1
    WHERE 1 = 1
    AND ParticipantNo = {}
    */
    joinRoom: async(req ,res , next ) => {// 채팅 메시지의 notReadCount를 감소
        try{
            console.log(req.body);
            const participantNo = req.body.ParticipantNo;

            const results = await models.Chat.update({
                notReadCount: notReadCount - 1
            },{
                where: {
                    ParticipantNo: participantNo,
                }
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
    }

}
