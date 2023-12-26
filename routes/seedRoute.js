const express = require('express');
const Movie = require('../models/movie.js');
const Producer = require('../models/producer.js');
const Actor = require('../models/actor.js');
const data = require('../data.js');
const multerConfig = require('../utils/cloudinaryConfig.js');
const cloudinary = require('../utils/cloudinaryConfig.js');
const util = require('util');


const seedRouter = express.Router();
const upload = multerConfig.single('poster'); // 'poster' should be the name attribute of your file input

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

    // Insert movies with Cloudinary image upload using Multer
    const insertedMovies = await Promise.all(moviesWithIds.map(async (movie) => {
      const { poster, ...movieData } = movie;

      // Use Multer to handle file upload
      const multerUpload = util.promisify(upload);
      await multerUpload(req, res);

      // If a file is uploaded, upload it to Cloudinary
      if (req.file) {
        const cloudinaryResponse = await cloudinary.v2.uploader.upload(req.file.path);

        // Create a new movie with the Cloudinary URL
        const newMovie = new Movie({
          ...movieData,
          poster: cloudinaryResponse.secure_url,
        });

        return newMovie.save();
      }

      // If no file is uploaded, create a new movie without a poster
      const newMovie = new Movie({
        ...movieData,
      });

      return newMovie.save();
    }));

    console.log('Data inserted successfully:', insertedMovies, insertedProducers, insertedActors);
    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = seedRouter;
