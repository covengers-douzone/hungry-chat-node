const models = require('../models');
const redis = require('../redis')
module.exports = {
    getUserList: async (req,res,next) => {
        try{
            const results = await models.User.findAll();
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
