const express = require('express');
const router = express.Router();

const camionController = require('../controllers/camion.controller');


router.get('/disponibles', camionController.getDisponibles);
router.post('/', camionController.createCamion);
router.get('/', camionController.getAllCamions);
router.get('/:id', camionController.getCamionById);
router.patch('/:id', camionController.updateCamion);
router.patch('/:id/status', camionController.updateStatus);
router.patch('/:id/archive', camionController.archiveCamion);

module.exports = router;
