const {express}=require("../config/Constant")
const router = express.Router();
const { sendMessage, getMessage, deleteMessage, updateMessage, getChattedUsers } = require('../controller/ChatController'); 

const { signup, login } = require('../controller/UserController');
const { authentication } = require('../middleware/Authentication')

router.post("/signup", signup);
router.post("/login", login);

router.post('/message', authentication, sendMessage); 
router.get('/getMessage/:id', authentication, getMessage); 
router.delete('/deleteMessage/:messageId', authentication, deleteMessage);
router.put('/updateMessage/:messageId',authentication, updateMessage);
router.get("/userlist",authentication,getChattedUsers);

module.exports = router;
