const express = require('express');
const controller = require('../controllers/chat');
const auth = require('./authorized');

const router = express.Router();
router.route('/roomlist/:userNo').get(auth("ROLE_USER"), controller.getRoomList);
router.route('/chatlist/:roomNo').get(controller.getChatList);
//router.route('/message').post(controller.send);
//router.route('/create').post(controller.create);
//router.route('/setStatus').post(controller.updateStatus);
router.route('/getFriendList').post(controller.getFriendList);
router.route('/chatlist/:roomNo').get(auth("ROLE_USER"), controller.getChatList);
router.route('/message').post(auth("ROLE_USER"), controller.send);
router.route('/create').post(auth("ROLE_USER"), controller.create);
router.route('/setStatus').post(auth("ROLE_USER"), controller.updateStatus);
router.route('/getHeadCount').post(controller.getHeadCount);
router.route('/updateSendNotReadCount').post(controller.updateSendNotReadCount);
module.exports = router;