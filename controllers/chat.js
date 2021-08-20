const models = require('../models');
const redis = require('../redis')
module.exports = {
    getRoomList: async (req,res,next) => {
        try{
            const {userNo} = req.query;
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
            const {roomNo} = req.query;
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
