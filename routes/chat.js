const express = require('express');
const controller = require('../controllers/chat');
const auth = require('./authorized');

const router = express.Router();
router.route('/roomlist/:userNo').get(auth("ROLE_USER"), controller.getRoomList);
router.route('/chatlist/:roomNo').get(auth("ROLE_USER"), controller.getChatList);
router.route('/message').post(auth("ROLE_USER"), controller.send);
router.route('/create').post(auth("ROLE_USER"),controller.create);
router.route('/setStatus').post(auth("ROLE_USER"), controller.updateStatus);
module.exports = router;