const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');

// Routes for actors
router.get('/actors', actorController.getAllActors);
router.get('/actors/:id', actorController.getActorById);
router.post('/actors', actorController.addActor);

module.exports = router;
