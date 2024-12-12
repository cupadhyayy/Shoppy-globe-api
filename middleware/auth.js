// Import the 'jsonwebtoken' package to handle JWT verification
const jwt = require('jsonwebtoken');

// Middleware function to protect routes that require authentication
const protect = (req, res, next) => {
    // Extract the token from the 'Authorization' header
    const token = req.headers['authorization']?.split(' ')[1]; 

    // If no token is provided, return an error response with a 401 status code
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Verify the token using the secret key stored in environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user data to the request object (req.user) for downstream use
        req.user = decoded;

        // Call the next middleware function to continue processing the request
        next();
    } catch (err) {
        // If token verification fails (either invalid or expired), return a 401 error
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Export the middleware function so it can be used in other files
module.exports = protect;
