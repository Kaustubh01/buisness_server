const express = require('express');
const { register, login, getUser, seeEmployeePendingRequests } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddlewares');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/user', getUser);
router.post('/pending',authMiddleware, seeEmployeePendingRequests);

module.exports = router;
