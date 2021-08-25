const express = require('express');
const controller = require('../controllers/chat');
const auth = require('./authorized');

const router = express.Router();
router.route('/roomlist/:userNo').get(auth("ROLE_USER"), controller.getRoomList);
router.route('/chatlist/:roomNo').get(controller.getChatList);
// router.route('').get(controller.readAll);
// router.route('/joinRoom').get(controller.join);
// router.route('/exitRoom').get(controller.exit);
router.route('/message').post(controller.send);
router.route('/create').post(controller.create);
module.exports = router;