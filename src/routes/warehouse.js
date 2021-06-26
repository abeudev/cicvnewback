const router = require('express').Router();
const auth = require('../libraries/auth');
const Warehouse = require('../controllers/WarehouseController');



router.post('/', Warehouse.create);

router.put('/',  Warehouse.update);



router.post('/table',  Warehouse.table);



router.get('/:warehouseID',  Warehouse.detail_by_id);
router.delete('/:warehouseID',  Warehouse.delete_by_id);


module.exports = router;
