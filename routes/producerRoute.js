const express = require('express');
const router = express.Router();
const producerController = require('../controllers/producerController');

// Routes for producers
router.get('/producers', producerController.getAllProducers);
router.get('/producers/:id', producerController.getProducerById);
router.post('/producers', producerController.addProducer);

module.exports = router;
