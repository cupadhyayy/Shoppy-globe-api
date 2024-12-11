const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // Token expires in 1 hour
    expiresIn: '1h', 
  });
};

module.exports = generateToken;
