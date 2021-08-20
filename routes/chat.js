const express = require('express');
const controller = require('../controllers/chat');

const router = express.Router();
router.route('/userlist').get(controller.getUserList);
// router.route('').get(controller.readAll);
// router.route('/joinRoom').get(controller.join);
// router.route('/exitRoom').get(controller.exit);
// router.route('/message/:user/:room/:message').post(controller.send);
// router.route('/create').get(controller.create);
module.exports = router;