const router = require('express').Router();
const auth = require('../libraries/auth');
const Message = require('../controllers/MessageController');



router.post('/', Message.create);
router.get('/:conversationId', Message.getMessageByConvId);

module.exports = router;
