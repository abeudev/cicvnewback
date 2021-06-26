const router = require('express').Router();
const auth = require('../libraries/auth');
const Conversation = require('../controllers/ConversationController');



router.post('/', Conversation.create);

router.put('/',  Conversation.update);



router.post('/table',  Conversation.table);



router.get('/:conversationID',  Conversation.detail_by_id);
router.delete('/:conversationID',  Conversation.delete_by_id);


module.exports = router;
