// Importing mongoose to interact with MongoDB
const mongoose = require('mongoose');

// Defining the schema for the Cart collection
const cartSchema = new mongoose.Schema({
    // userId stores the ID of the user who owns the cart. This is a required field.
    userId: { type: String, required: true },

    // items is an array that holds the products in the cart
    items: [
        {
            // productId is a reference to the Product model, linking to the product being added to the cart.
            // It's required and must be a valid ObjectId that references the Product collection.
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

            // quantity represents how many of this product the user wants to purchase. It must be a positive number.
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
});

// Exporting the Cart model based on the cartSchema
// This model can be used to create, read, update, and delete documents in the 'Cart' collection.
module.exports = mongoose.model('Cart', cartSchema);
