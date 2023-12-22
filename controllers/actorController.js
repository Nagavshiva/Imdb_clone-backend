const Actor = require('../models/actor');

const getAllActors = async (req, res) => {
  try {
    const actors = await Actor.find();
    res.json(actors);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getActorById = async (req, res) => {
  const { id } = req.params;

  try {
    const actor = await Actor.findById(id);

    if (!actor) {
      return res.status(404).json({ error: 'Actor not found' });
    }

    res.json(actor);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addActor = async (req, res) => {
  try {
    const { name, gender, dob, bio } = req.body;

    // Validate input (you may want to add more validation)
    if (!name || !gender || !dob) {
      return res.status(400).json({ error: 'Name, gender, and dob are required fields.' });
    }

    // Create a new actor
    const newActor = new Actor({
      name,
      gender,
      dob,
      bio,
    });

    // Save the actor to the database
    const savedActor = await newActor.save();

    res.status(201).json(savedActor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getAllActors, getActorById, addActor };
