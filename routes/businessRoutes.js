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



module.exports = router;
