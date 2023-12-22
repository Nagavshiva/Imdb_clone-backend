const mongoose = require('mongoose');
const actorSchema = require('./actor');
const producerSchema = require('./producer');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    yearOfRelease: {
        type: Number,
        required: true,
    },
    plot: {
        type: String,
        required: true,
    },
    poster: String,
    producer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producer',
        required: true,
    },
    actors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor',
        required: true,
    }],
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
