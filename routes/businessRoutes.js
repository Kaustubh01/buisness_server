const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddlewares');
const businessController = require('../controllers/buisnessController');

// Business routes
router.post('/create', authMiddleware, businessController.createBusiness);
router.get('/all', authMiddleware, businessController.showBusinesses);
router.post('/invite', authMiddleware, businessController.inviteEmployee);
router.post('/accept', authMiddleware, businessController.acceptRequest);
router.post('/reject', authMiddleware, businessController.rejectRequest);
router.post('/employees/business', authMiddleware, businessController.showBuisnessforEmployee);

// Inventory routes
router.post('/add/products', authMiddleware, businessController.addProduct); // Add product
router.get('/products', authMiddleware, businessController.viewInventory); // View all products
router.get('/:businessId/products/:productId', authMiddleware, businessController.viewProduct); // View specific product
router.put('/:businessId/products/:productId', authMiddleware, businessController.updateProduct); // Update product
router.delete('/:businessId/products/:productId', authMiddleware, businessController.removeProduct); // Remove product

module.exports = router;
