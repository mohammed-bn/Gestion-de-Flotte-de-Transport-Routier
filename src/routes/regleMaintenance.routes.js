const express = require('express');
const router = express.Router();

const regleController = require('../controllers/regleMaintenance.controller');


router.post('/', regleController.createRegle);
router.get('/', regleController.getAllRegles);

module.exports = router;
