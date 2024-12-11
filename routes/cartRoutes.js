const express = require('express');
const Cart = require('../models/cart');
const Product = require('../models/product');

const protect = require('../middleware/auth');
const router = express.Router();
// Create or Update Cart
router.post('/', protect, async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        // Extract userId from token (via protect middleware)
        const userId = req.user.id;

        // Check if a cart exists for this user
        let cart = await Cart.findOne({ userId });
        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Invalid productId or quantity' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (!cart) {
            // If cart doesn't exist, create a new one
            cart = new Cart({ userId, items: [{ productId, quantity }] });
        } else {
            // If cart exists, check if the product is already in the cart
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (itemIndex > -1) {
                // If product exists, update quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // If product doesn't exist, add it to the cart
                cart.items.push({ productId, quantity });
            }
        }

        // Save the updated cart
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Get Cart by User ID
router.get('/:userId', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove Item from Cart
router.delete('/:userId/:productId', protect, async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Clear Cart
router.delete('/:userId', protect, async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ userId: req.params.userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//update cart product quantity
router.put('/:productId', protect, async (req, res) => {
    const { quantity } = req.body;
    const { productId } = req.params;

    try {
        // Validate quantity
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be a positive number' });
        }

        // Extract userId from token (via protect middleware)
        const userId = req.user.id;

        // Find the user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find the item index in the cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        // Update the quantity
        cart.items[itemIndex].quantity = quantity;

        // Save the updated cart
        await cart.save();

        // Return the updated cart
        res.status(200).json({ message: 'Cart item quantity updated', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
