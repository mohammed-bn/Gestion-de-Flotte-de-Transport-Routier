
const express = require('express');
const router = express.Router();

const trajetController = require('../controllers/trajet.controller');
const { protect } = require('../middlewares/auth.middleware');


router.get('/mes-trajets', protect, trajetController.getMyTrajets);

router.post('/', protect, trajetController.createTrajet);
router.get('/', protect, trajetController.getAllTrajets);
router.get('/:id', protect, trajetController.getTrajetById);
router.patch('/:id', protect, trajetController.updateTrajet);
router.delete('/:id', protect, trajetController.deleteTrajet);

router.patch('/:id/assigner', protect, trajetController.assignTrajet);

router.patch('/:id/statut', protect, trajetController.updateStatut);

router.patch('/:id/kilometrage', protect, trajetController.saisirKilometrage);
router.patch('/:id/carburant', protect, trajetController.saisirCarburant);

router.patch('/:id/remarque', protect, trajetController.ajouterRemarque);

module.exports = router;