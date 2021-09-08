const express = require('express');
const controller = require('../controllers/chat');
const auth = require('./authorized');
const multer = require("multer");


const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, `${__dirname}/../public/assets/images`);
    },
    filename:(req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
    }
})
const upload = multer({storage:storage});

//auth("ROLE_USER"),
const router = express.Router();
router.route('/roomlist/:userNo').get( controller.getRoomList);
router.route('/chatlist/:roomNo/:offset/:limit').get(controller.getChatList);
router.route('/chatlistCount/:roomNo/').get(controller.getChatListCount);
router.route('/getChat/:chatNo').get(controller.getChat);
//router.route('/message').post(controller.send);
//router.route('/create').post(controller.create);
//router.route('/setStatus').post(controller.updateStatus);
router.route('/chatlist/:roomNo').get( controller.getChatList);
router.route('/message').post(upload.single( "file"), controller.send);
router.route('/createRoom').post( controller.createRoom);
router.route('/createParticipant').post( controller.createParticipant);
router.route('/setStatus').post(controller.updateStatus);
router.route('/getHeadCount').post(controller.getHeadCount);
router.route('/updateSendNotReadCount').post(controller.updateSendNotReadCount);
router.route('/updateRoomNotReadCount').post(controller.updateRoomNotReadCount);
router.route('/updateLastReadAt').post(controller.updateLastReadAt);




router.route('/deleteChat').post(auth("ROLE_USER"), controller.deleteChat);
router.route('/getFriendList').post(auth("ROLE_USER"),controller.getFriendList);
router.route('/getFollowerList').post(auth("ROLE_USER"),controller.getFollowerList);
router.route('/getOpenChatRoomList').get(auth("ROLE_USER"), controller.getOpenChatRoomList);

router.route('/addFriend').post(auth("ROLE_USER"), controller.addFriend);
router.route('/deleteFriend').post(auth("ROLE_USER"), controller.deleteFriend);
router.route('/getUserByNo/:userNo').get(auth("ROLE_USER"), controller.getUserByNo);
router.route('/updateSettings').post(upload.single( "file"), auth("ROLE_USER"), controller.updateSettings);
router.route('/getLastReadNo').post(controller.getLastReadNo);
router.route('/getLastReadNoCount').post(controller.getLastReadNoCount);
router.route('/deleteChatNo/:chatNo').post(controller.deleteChatNo);

// layer 변경
router.route('/joinRoom').post(auth("ROLE_USER"),controller.joinRoom);
router.route('/leftRoom').post(controller.leftRoom);
module.exports = router;