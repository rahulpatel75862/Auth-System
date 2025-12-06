const express = require('express');
const { registerUser, signinUser, getCurrentUser } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddlewares');
const router = express.Router();



router.post('/register', registerUser)
router.post('/login', signinUser);
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;