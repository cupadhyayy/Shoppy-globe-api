// Import necessary libraries
const mongoose = require('mongoose');  // Mongoose for MongoDB schema modeling
const bcrypt = require('bcryptjs');    // Bcrypt for hashing and comparing passwords

// Define the schema for the user model
const userSchema = new mongoose.Schema({
  // 'username' field: a required string that must be unique
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // 'email' field: a required string that must be unique
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // 'password' field: a required string to store the user's password
  password: {
    type: String,
    required: true,
  },
});

// Pre-save middleware to hash the password before saving to the database
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) return next();

  // Hash the password using bcrypt with a salt rounds value of 10
  this.password = await bcrypt.hash(this.password, 10);

  // Continue with the save operation
  next();
});

// Method to compare the provided password with the stored hashed password
userSchema.methods.comparePassword = async function(password) {
  // Return a promise that resolves to a boolean indicating whether the passwords match
  return bcrypt.compare(password, this.password);
};

// Export the model based on the schema defined above
module.exports = mongoose.model('User', userSchema);
