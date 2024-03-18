const express = require("express");
const router = express.Router();
const { handleMessage, getMessage } = require('../controller/ChatController'); 

const { signup, login } = require('../controller/UserController');
const { authentication } = require('../middleware/Authentication')

router.post("/signup", signup);
router.post("/login", login);

router.post('/message', authentication, handleMessage); 
router.get('/getMessage/:email', authentication, getMessage); 

module.exports = router;
