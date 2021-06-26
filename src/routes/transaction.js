const router = require('express').Router();
const auth = require('../libraries/auth');
const Transaction = require('../controllers/TransactionController');



router.post('/', Transaction.create);

router.put('/',  Transaction.update);



router.post('/table',  Transaction.table);



router.get('/:transactionID',  Transaction.detail_by_id);
router.delete('/:transactionID',  Transaction.delete_by_id);


module.exports = router;
