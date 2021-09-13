const models = require('../models');
const redis = require('redis');
const client = redis.createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT })
const pubClient = client.duplicate();
const moment = require('moment');
const {Op} = require('sequelize');
const fs = require('fs');
const {user} = require("../redis-conf");
const chatService = require('../services/chat');
const {sequelize} = require("../models");

module.exports = {
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
    getChatList: async (req, res, next) => {
        try {
            const roomNo = req.params.roomNo;
            const limit = req.params.limit;
            const offset = req.params.offset
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
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (err) {
            res
                .status(200)
                .send({
                    result: 'fail',
                    data: null,
                    message: "System Error"
                });
        }
    },
    getChatListCount: async (req, res, next) => {
        try {
            const roomNo = req.params.roomNo;

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
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (err) {
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
    createRoom : async(req ,res , next ) => {
        try{
            const title = req.body.title;
            const content = req.body.content;
            const headCount = req.body.headCount;
            const type = req.body.type;
            const password = req.body.password;

            const results = await models.Room.create({
                title, content, password,type,headCount
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
    getOpenChatRoomList: async (req,res,next) => {
        try{
            const type = req.params.type
            const roomList = (await models.Room.findAll({
                where:{
                    type: type
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

            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch (err){
            console.error(`Fetch-Api : getOpenChatRoomList Error : ${err.status} ${err.message}`);
        }
    },
    joinRoom : async(req ,res , next ) => {
        try{
            const results = await chatService.joinRoom(req.body);

            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch(e){
            res
                .status(400)
                .send({
                    result: 'fail',
                    data: null,
                    message: e.message
                });
        }
    },
    leftRoom : async(req ,res , next ) => {
        try{
            const participantNo = req.body.participantNo;
            const results = await chatService.leftRoom(participantNo);
            res
                .status(200)
                .send({
                    result: 'success',
                    data: results,
                    message: null
                });
        } catch(e){
            res
                .status(400)
                .send({
                    result: 'fail',
                    data: null,
                    message: e.message
                });
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
                        [Op.gt]: participant.lastReadAt
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
    getLastReadNoCount: async(req ,res , next ) => {
        try{
            const participantNo = req.body.participantNo;
            const participant = await models.Participant.findByPk(participantNo);
            const results = await models.Chat.findAndCountAll({
                where:{
                    roomNo : participant.roomNo,
                    createdAt: {
                        [Op.gt]: participant.lastReadAt
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
}