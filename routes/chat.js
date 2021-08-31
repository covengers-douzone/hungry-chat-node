const express = require('express');
const controller = require('../controllers/chat');
const auth = require('./authorized');

//auth("ROLE_USER"),
const router = express.Router();
router.route('/roomlist/:userNo').get( controller.getRoomList);
router.route('/chatlist/:roomNo').get(controller.getChatList);
//router.route('/message').post(controller.send);
//router.route('/create').post(controller.create);
//router.route('/setStatus').post(controller.updateStatus);
router.route('/getFriendList').post(controller.getFriendList);
router.route('/chatlist/:roomNo').get( controller.getChatList);
router.route('/message').post( controller.send);
router.route('/createRoom').post( controller.createRoom);
router.route('/createParticipant').post( controller.createParticipant);
router.route('/setStatus').post(controller.updateStatus);
router.route('/getHeadCount').post(controller.getHeadCount);
router.route('/updateSendNotReadCount').post(controller.updateSendNotReadCount);
router.route('/updateRoomNotReadCount').post(controller.updateRoomNotReadCount);
router.route('/updateLastReadAt').post(controller.updateLastReadAt);
router.route('/getNickname').get(auth("ROLE_USER"), controller.getNickname);
module.exports = router;