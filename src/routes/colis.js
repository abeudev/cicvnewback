const router = require('express').Router();
const auth = require('../libraries/auth');
const Colis = require('../controllers/ColisController');



router.post('/', Colis.create);

router.put('/',  Colis.update);



router.post('/table',  Colis.table);



router.get('/:colisID',  Colis.detail_by_id);
router.delete('/:colisID',  Colis.delete_by_id);


module.exports = router;
