const express = require('express');
const Movie = require('../models/movie.js');
const Producer = require('../models/producer.js');
const Actor = require('../models/actor.js');
const data = require('../data.js');

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
    try {
        // Insert producers
        const insertedProducers = await Producer.insertMany(data.movies.map(movie => movie.producer));

        // Insert actors
        const insertedActors = await Actor.insertMany(data.movies.flatMap(movie => movie.actors));

        // Map the producer and actor IDs to the corresponding movies
        const moviesWithIds = data.movies.map((movie, index) => {
            const producer = insertedProducers.find(producer => producer.name === movie.producer.name);

            if (!producer) {
                throw new Error(`Producer not found for movie: ${movie.name}`);
            }

            const actorIds = movie.actors.map((actor, actorIndex) => {
                const insertedActor = insertedActors.find(a => a.name === actor.name);
                
                if (!insertedActor) {
                    throw new Error(`Actor not found for movie: ${movie.name}, actor: ${actor.name}`);
                }

                return insertedActor._id;
            });

            return {
                ...movie,
                producer: producer._id,
                actors: actorIds,
            };
        });

        // Insert movies
        const insertedMovies = await Movie.insertMany(moviesWithIds);

        console.log('Data inserted successfully:', insertedMovies, insertedProducers, insertedActors);
        res.status(200).json({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = seedRouter;

