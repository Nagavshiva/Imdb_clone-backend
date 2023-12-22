const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Routes for movies
router.get('/movies', movieController.getAllMovies);
router.get('/movies/:id', movieController.getMovieById);
router.post('/movies', movieController.addMovie);
router.put('/movies/:id', movieController.editMovie);

module.exports = router;
