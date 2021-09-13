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

//
const router = express.Router();
router.route('/roomlist/:userNo').get(auth(["ROLE_USER"] , ["ROLE_UNKNOWN"]),controller.getRoomList);
router.route('/chatlist/:roomNo/:offset/:limit').get(auth(["ROLE_USER"] , ["ROLE_UNKNOWN"]),controller.getChatList);
router.route('/chatlistCount/:roomNo/').get(auth(["ROLE_USER"] , ["ROLE_UNKNOWN"]),controller.getChatListCount);
router.route('/getChat/:chatNo').get(auth(["ROLE_USER"] , ["ROLE_UNKNOWN"]),controller.getChat);

router.route('/chatlist/:roomNo').get(auth(["ROLE_USER"] , ["ROLE_UNKNOWN"]), controller.getChatList);
router.route('/message').post(auth(["ROLE_USER"] , ["ROLE_UNKNOWN"]),upload.single( "file"), controller.send);
router.route('/createRoom').post(auth(["ROLE_USER"] , ["ROLE_UNKNOWN"]),controller.createRoom);
router.route('/createParticipant').post(auth(["ROLE_USER"]),controller.createParticipant);
router.route('/setStatus').post(auth(["ROLE_USER"]),controller.updateStatus);
router.route('/getHeadCount').post(auth(["ROLE_USER"]),controller.getHeadCount);
router.route('/updateSendNotReadCount').post(auth(["ROLE_USER"]),controller.updateSendNotReadCount);
router.route('/updateRoomNotReadCount').post(auth(["ROLE_USER"]),controller.updateRoomNotReadCount);
router.route('/updateLastReadAt').post(auth(["ROLE_USER"]),controller.updateLastReadAt);




router.route('/deleteChat').post( auth(["ROLE_USER"]),controller.deleteChat);
router.route('/getFriendList').post(auth(["ROLE_USER"]),controller.getFriendList);
router.route('/getFollowerList').post(auth(["ROLE_USER"]),controller.getFollowerList);
router.route('/getOpenChatRoomList/:type').get(auth(["ROLE_USER"] , ["ROLE_UNKNOWN"]),controller.getOpenChatRoomList);

router.route('/addFriend').post( auth(["ROLE_USER"]),controller.addFriend);
router.route('/deleteFriend').post( auth(["ROLE_USER"]),controller.deleteFriend);
router.route('/getUserByNo/:userNo').get( auth(["ROLE_USER"]),controller.getUserByNo);
router.route('/updateSettings').post(upload.single( "file"),auth(["ROLE_USER"]), controller.updateSettings);
router.route('/deleteUserInfo').post( auth(["ROLE_USER"]),controller.deleteUserInfo);
router.route('/getLastReadNo').post(auth(["ROLE_USER"] , ["ROLE_UNKNOWN"]),controller.getLastReadNo);
router.route('/getLastReadNoCount').post(auth(["ROLE_USER"] , ["ROLE_UNKNOWN"]),controller.getLastReadNoCount);
router.route('/deleteChatNo/:chatNo').post(auth(["ROLE_USER"]),controller.deleteChatNo);

// layer 변경
router.route('/joinRoom').post(auth(["ROLE_USER"] , ["ROLE_UNKNOWN"]),controller.joinRoom);
router.route('/leftRoom').post(auth(["ROLE_USER"] , ["ROLE_UNKNOWN"]),controller.leftRoom);
module.exports = router;