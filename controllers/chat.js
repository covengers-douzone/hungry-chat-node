const models = require('../models');
const redis = require('redis');
const client = redis.createClient({host: "localhost", port: 6379});
const pubClient = client.duplicate();
const moment = require('moment');

module.exports = {
    getRoomList: async (req,res,next) => {
        try{
            const userNo = req.params.userNo;
            console.log("UERNO!!!!!!!!!!!!!!:" + userNo,req.params.userNo);
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
            const type = "TEXT"
            const contents = req.body.contents
            const notReadCount = 0;
            const participantNo =  1;
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
            const userNo = 1;
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
    }
    // readAll: async function(req, res, next) {
    //     try {
    //         const results = await model.findAllUsers();
    //         res
    //             .status(200)
    //             .send({
    //                 result: 'success',
    //                 data: results,
    //                 message: null
    //             });
    //
    //
    //     } catch(err){
    //       next(err);
    //     }
    // },
    // send: async function(req, res, next) {
    //
    //     try {
    //         console.log("fetch" + req.params);
    //
    //         const results = req.params;
    //         res
    //             .status(200)
    //             .send({
    //                 result: 'success',
    //                 data: results,
    //                 message: null
    //             });
    //   new redis().publish(`${req.params.room}` , `${req.params.user}:${req.params.room}:${req.params.message}`)
    //
    //     } catch(err){
    //         next(err);
    //     }
    // },
    //  join: async function(req, res, next) {
    //     try {
    //
    //         const results = await model.findAllUsers();
    //         res
    //             .status(200)
    //             .send({
    //                 result: 'success',
    //                 data: results,
    //                 message: null
    //
    //             });
    //     } catch(err){
    //         next(err);
    //     }
    // },
    // exit: async function(req, res, next) {
    //     try {
    //         const results = await model.findAllUsers();
    //         res
    //             .status(200)
    //             .send({
    //                 result: 'success',
    //                 data: results,
    //                 message: null
    //             });
    //     } catch(err){
    //         next(err);
    //     }
    // },
    // create: async function(req, res, next) {
    //     try {
    //         const results = await model.findAllUsers();
    //         res
    //             .status(200)
    //             .send({
    //                 result: 'success',
    //                 data: results,
    //                 message: null
    //             });
    //     } catch(err){
    //         next(err);
    //     }
    // },

}
