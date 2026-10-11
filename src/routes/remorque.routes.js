
const express = require('express');
const router = express.Router();
const remorqueController = require('../controllers/remorque.controller');

router.get('/disponibles', remorqueController.getDisponibles);
router.get('/', remorqueController.getAllRemorques);
router.post('/', remorqueController.createRemorque);
router.get('/:id', remorqueController.getRemorqueById);
router.patch('/:id', remorqueController.updateRemorque);
router.patch('/:id/status', remorqueController.updateStatus);
router.patch('/:id/archive', remorqueController.archiveRemorque);

module.exports = router;