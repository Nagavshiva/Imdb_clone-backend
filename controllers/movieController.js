const Movie = require('../models/movie');
const Producer = require('../models/producer');
const Actor = require('../models/actor');
const data = require('../data');


const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find().populate('producer actors');
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getMovieById = async (req, res) => {
    const { id } = req.params;

    try {
        const movie = await Movie.findById(id).populate('producer actors');

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addMovie = async (req, res) => {
    try {
        const { name, yearOfRelease, plot, poster, producer, actors } = req.body;

        // Validate input (you may want to add more validation)
        if (!name || !yearOfRelease || !plot || !producer || !actors) {
            return res.status(400).json({ error: 'Name, yearOfRelease, plot, producer, and actors are required fields.' });
        }

        // Check if the producer exists
        const existingProducer = await Producer.findById(producer);

        if (!existingProducer) {
            return res.status(400).json({ error: 'Producer not found' });
        }

        // Create an array to store new actor objects
        const newActors = [];

        // Iterate through the provided actors
        for (const actorData of actors) {
            // Check if the actor already exists
            const existingActor = await Actor.findOne({ name: actorData.name });

            if (existingActor) {
                // If the actor exists, use the existing actor
                newActors.push(existingActor._id);
            } else {
                // If the actor doesn't exist, create a new actor
                const newActor = new Actor(actorData);
                const savedActor = await newActor.save();
                newActors.push(savedActor._id);
            }
        }

        // Create a new movie
        const newMovie = new Movie({
            name,
            yearOfRelease,
            plot,
            poster,
            producer: existingProducer._id,
            actors: newActors,
        });

        // Save the movie to the database
        const savedMovie = await newMovie.save();

        res.status(201).json(savedMovie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const editMovie = async (req, res) => {
    const { id } = req.params;
    const { name, yearOfRelease, plot, poster, producer, actors } = req.body;

    try {
        // Validate input (you may want to add more validation)
        if (!name || !yearOfRelease || !plot || !producer || !actors) {
            return res.status(400).json({ error: 'Name, yearOfRelease, plot, producer, and actors are required fields.' });
        }

        // Check if the movie exists
        const existingMovie = await Movie.findById(id);

        if (!existingMovie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Check if the producer and actors exist
        const existingProducer = await Producer.findById(producer);
        const existingActors = await Actor.find({ _id: { $in: actors } });

        if (!existingProducer) {
            return res.status(400).json({ error: 'Producer not found' });
        }

        if (existingActors.length !== actors.length) {
            return res.status(400).json({ error: 'One or more actors not found' });
        }

        // Update the movie
        existingMovie.name = name;
        existingMovie.yearOfRelease = yearOfRelease;
        existingMovie.plot = plot;
        existingMovie.poster = poster;
        existingMovie.producer = producer;
        existingMovie.actors = actors;

        // Save the updated movie
        const updatedMovie = await existingMovie.save();

        res.json(updatedMovie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllMovies, getMovieById, addMovie, editMovie };
