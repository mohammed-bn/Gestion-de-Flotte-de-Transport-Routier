
const express = require('express');
const router = express.Router();

const maintenanceController = require('../controllers/maintenance.controller');
const { protect } = require('../middlewares/auth.middleware');

// probléme mantenance

router.post('/problemes', protect, maintenanceController.createProbleme);
router.get('/problemes', protect, maintenanceController.getAllProblemes);
router.get('/problemes/:id', protect, maintenanceController.getProblemeById);
router.patch('/problemes/:id', protect, maintenanceController.updateProbleme);
router.delete('/problemes/:id', protect, maintenanceController.deleteProbleme);

// maintenance

router.post('/', protect, maintenanceController.createMaintenance);
router.get('/', protect, maintenanceController.getAllMaintenances);
router.patch('/:id', protect, maintenanceController.updateMaintenance);
router.delete('/:id', protect, maintenanceController.deleteMaintenance);
router.get('/alertes', protect, maintenanceController.getAlertes);
router.patch('/alertes/:id/resoudre', protect, maintenanceController.resolveAlerte);
router.get('/historique/vehicule/:id', protect, maintenanceController.getHistoriqueVehicule);
router.get('/:id', protect, maintenanceController.getMaintenanceById);

module.exports = router;