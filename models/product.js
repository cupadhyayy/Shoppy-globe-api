// Import mongoose to interact with MongoDB
const mongoose = require('mongoose');

// Define the schema for the 'Product' model
const productSchema = new mongoose.Schema({
  // The 'name' field, which is required and must be a string
  name: {
    type: String,
    required: [true, 'Product name is required'],  // Custom error message if 'name' is not provided
  },
  
  // The 'price' field, which is required and must be a number
  price: {
    type: Number,
    required: [true, 'Product price is required'], // Custom error message if 'price' is not provided
  },
  
  // The 'description' field, which is required and must be a string
  description: {
    type: String,
    required: [true, 'Product description is required'], // Custom error message if 'description' is not provided
  },
  
  // The 'category' field, which is an optional string
  category: String,

  // The 'stock' field, which is optional and defaults to 0 if not provided
  stock: {
    type: Number,
    default: 0,  // Default value of 0 if 'stock' is not specified
  },
});

// Export the 'Product' model based on the productSchema
module.exports = mongoose.model('Product', productSchema);
