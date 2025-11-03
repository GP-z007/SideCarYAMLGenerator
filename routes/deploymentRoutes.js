const express = require('express');
const router = express.Router();
const deploymentController = require('../controllers/deploymentController');

router.post('/generate-yaml', deploymentController.generateYaml);

module.exports = router;
