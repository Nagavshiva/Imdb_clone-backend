const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

});



// Create the User model based on the schema
const User = mongoose.model('User', userSchema);

// Export the User model to be used in other parts of your application
module.exports = User;
