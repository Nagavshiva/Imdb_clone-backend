const Producer = require('../models/producer.js');

const getAllProducers = async (req, res) => {
    try {
        const producers = await Producer.find();
        res.status(200).json(producers);
    } catch (error) {
        console.error('Error getting producers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getProducerById = async (req, res) => {
    const producerId = req.params.id;

    try {
        const producer = await Producer.findById(producerId);

        if (!producer) {
            return res.status(404).json({ error: 'Producer not found' });
        }

        res.status(200).json(producer);
    } catch (error) {
        console.error('Error getting producer by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addProducer = async (req, res) => {
    const { name, gender, dob, bio } = req.body;

    try {
        const newProducer = await Producer.create({
            name,
            gender,
            dob,
            bio,
        });

        res.status(201).json(newProducer);
    } catch (error) {
        console.error('Error adding producer:', error);

        // Check for validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Validation Error', details: error.errors });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllProducers,
    getProducerById,
    addProducer,
};
