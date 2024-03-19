// const express = require("express");
const {express}=require("../config/Constant")
const router = express.Router();
const { sendMessage, getMessage, deleteMessage, updateMessage } = require('../controller/ChatController'); 

const { signup, login } = require('../controller/UserController');
const { authentication } = require('../middleware/Authentication')

router.post("/signup", signup);
router.post("/login", login);

router.post('/message', authentication, sendMessage); 
router.get('/getMessage/:email', authentication, getMessage); 
router.delete('/deleteMessage/:messageId', authentication, deleteMessage);
router.put('/updateMessage/:messageId',authentication, updateMessage);

module.exports = router;
