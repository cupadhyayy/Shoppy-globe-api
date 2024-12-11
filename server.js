const express = require('express');
const mongoose = require('mongoose');
const app = express();
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const bodyParser = require('body-parser');
const Product = require('./models/product');
const PORT = 3000;
//mongodb://localhost:27017/shoppy-globe
const dbUrl = 'mongodb://localhost:27017/shoppy-globe';
const dotenv = require('dotenv');
const protect = require('./middleware/auth');
const authRoutes = require('./routes/auth');
dotenv.config();
// Middleware
app.use(express.json());

// Database Connection
mongoose.connect(dbUrl, {
   family:4
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Database connection error:', err));

// Start Server
app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running,   and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
}
);

app.get('/', (req, res) => {
    res.send('Hello');
});

//routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);