const express = require('express');
const controller = require('../controllers/chatMember');
const auth = require('./authorized');
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/../public/assets/images`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
    }
})
const upload = multer({storage: storage});

//
const router = express.Router();

router.route('/createParticipant').post(auth(["ROLE_USER"]), controller.createParticipant);
router.route('/setStatus').post(auth(["ROLE_USER"]), controller.updateStatus);
router.route('/getHeadCount').post(auth(["ROLE_USER"]), controller.getHeadCount);
router.route('/updateSendNotReadCount').post(auth(["ROLE_USER"]), controller.updateSendNotReadCount);
router.route('/updateRoomNotReadCount').post(auth(["ROLE_USER"]), controller.updateRoomNotReadCount);
router.route('/updateLastReadAt').post(auth(["ROLE_USER"]), controller.updateLastReadAt);

router.route('/deleteChat').post(auth(["ROLE_USER"]), controller.deleteChat);
router.route('/getFriendList').post(auth(["ROLE_USER"]), controller.getFriendList);
router.route('/getFollowerList').post(auth(["ROLE_USER"]), controller.getFollowerList);

router.route('/addFriend').post(auth(["ROLE_USER"]), controller.addFriend);
router.route('/deleteFriend').post(auth(["ROLE_USER"]), controller.deleteFriend);
router.route('/getUserByNo/:userNo').get(auth(["ROLE_USER"]), controller.getUserByNo);
router.route('/updateSettings').post(auth(["ROLE_USER"]), upload.single("file"), controller.updateSettings);
router.route('/deleteUserInfo').post(auth(["ROLE_USER"]), controller.deleteUserInfo);

router.route('/deleteChatNo/:chatNo').post(auth(["ROLE_USER"]), controller.deleteChatNo);






module.exports = router;