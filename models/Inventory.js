const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    unitsSold: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
