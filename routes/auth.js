const express = require('express');
const User = require('../models/user');
const generateToken = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const router = express.Router();
const protect = require('../middleware/auth');

// User Registration (Sign Up)
router.post('/register', async (req, res) => {
  // Destructure the data from the request body
  const { username, email, password } = req.body;

  try {
    // Check if a user already exists with the provided email
    const userExists = await User.findOne({ email });
    if (userExists) {
      // If user exists, send a response with an error
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user document
    const user = new User({ username, email, password });
    // Save the new user to the database
    await user.save();

    // Generate a JWT token using the user's ID
    const token = generateToken(user._id);

    // Respond with a success message and the generated token
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    // If there's an error, return a server error
    res.status(500).json({ error: 'Server error' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  // Destructure the email and password from the request body
  const { email, password } = req.body;

  try {
    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      // If user not found, return an error message
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if the provided password matches the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // If password doesn't match, return an error message
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token using the user's ID
    const token = generateToken(user._id);

    // Respond with a success message and the generated token
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    // If there's a server error, return a server error response
    res.status(500).json({ error: 'Server error' });
  }
});

// Get User Profile (Protected Route)
router.get('/profile', protect, async (req, res) => {
    try {
        // Fetch user profile based on the user ID extracted from the token
        const user = await User.findById(req.user.id).select('-password');

        // If no user is found, send a 404 response
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send the user data as the response
        res.status(200).json(user);
    } catch (error) {
        // If there is an error, return a server error
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
