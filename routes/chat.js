const express = require('express');
const controller = require('../controllers/chat');

const router = express.Router();
router.route('/roomlist').get(controller.getRoomList);
router.route('/chatlist/:roomNo').get(controller.getChatList);
// router.route('').get(controller.readAll);
// router.route('/joinRoom').get(controller.join);
// router.route('/exitRoom').get(controller.exit);
router.route('/message/:user/:room/:message').post(controller.send);
// router.route('/create').get(controller.create);
module.exports = router;