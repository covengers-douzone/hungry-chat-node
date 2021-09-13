const express = require('express');
const controller = require('../controllers/chatUnknown');
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

router.route('/roomlist/:userNo').get(auth(["ROLE_USER"], ["ROLE_UNKNOWN"]), controller.getRoomList);
router.route('/chatlist/:roomNo/:offset/:limit').get(auth(["ROLE_USER"], ["ROLE_UNKNOWN"]), controller.getChatList);
router.route('/chatlistCount/:roomNo/').get(auth(["ROLE_USER"], ["ROLE_UNKNOWN"]), controller.getChatListCount);
router.route('/getChat/:chatNo').get(auth(["ROLE_USER"], ["ROLE_UNKNOWN"]), controller.getChat);

router.route('/chatlist/:roomNo').get(auth(["ROLE_USER"], ["ROLE_UNKNOWN"]), controller.getChatList);
router.route('/message').post(upload.single("file"), controller.send);
router.route('/createRoom').post(auth(["ROLE_USER"], ["ROLE_UNKNOWN"]), controller.createRoom);


router.route('/getOpenChatRoomList/:type').get(auth(["ROLE_USER"], ["ROLE_UNKNOWN"]), controller.getOpenChatRoomList);

// layer 변경
router.route('/joinRoom').post(auth(["ROLE_USER"], ["ROLE_UNKNOWN"]), controller.joinRoom);
router.route('/leftRoom').post(auth(["ROLE_USER"], ["ROLE_UNKNOWN"]), controller.leftRoom);

router.route('/getLastReadNo').post(auth(["ROLE_USER"], ["ROLE_UNKNOWN"]), controller.getLastReadNo);
router.route('/getLastReadNoCount').post(auth(["ROLE_USER"], ["ROLE_UNKNOWN"]), controller.getLastReadNoCount);






module.exports = router;
// //비회원 로직
// router.route('/exitPage').post(auth(["ROLE_UNKNOWN"]), controller.exitPage);
// router.route('/updateHeadCount').post(auth(["ROLE_USER"], ["ROLE_UNKNOWN"]), controller.updateHeadCount);
