
const express = require('express');
const router = express.Router();

const missionController = require('../controllers/mission.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/mes-missions', protect, missionController.getMyMissions);
router.get('/:id/pdf', protect, missionController.generatePDF);

//crud pour mission
router.post('/', protect, missionController.createMission);
router.get('/', protect, missionController.getAllMissions);
router.get('/:id', protect, missionController.getMissionById);
router.patch('/:id', protect, missionController.updateMission);
router.delete('/:id', protect, missionController.deleteMission);

module.exports = router;