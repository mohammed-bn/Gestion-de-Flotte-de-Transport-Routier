const express = require('express');
const router = express.Router();

const carburantController = require('../controllers/carburant.controller');
const { protect } = require('../middlewares/auth.middleware');


router.use(protect);

router.get('/camion/:id', carburantController.getByCamion);
router.get('/consommation/:camionId', carburantController.getConsommationMoyenne);


router.post('/', carburantController.createCarburant);
router.get('/', carburantController.getAllCarburants);
router.get('/:id', carburantController.getCarburantById);
router.patch('/:id', carburantController.updateCarburant);
router.delete('/:id', carburantController.deleteCarburant);

module.exports = router;
