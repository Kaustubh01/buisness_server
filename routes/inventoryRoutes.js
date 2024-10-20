const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddlewares');
const businessController = require('../controllers/buisnessController');


// Inventory routes
router.post('/:businessId/products', businessController.addProduct); // Add product
router.get('/:businessId/all',  businessController.viewInventory); // View all products
router.get('/:businessId/products/:productId',  businessController.viewProduct); // View specific product
router.put('/:businessId/products/:productId',  businessController.updateProduct); // Update product
router.delete('/:businessId/products/:productId',  businessController.removeProduct); // Remove product

module.exports = router;