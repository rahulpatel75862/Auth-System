const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser} = require('../controllers/userController');
const { verifyRole, verifyToken } = require('../middlewares/authMiddlewares');
const router = express.Router();
router.get('/get/users', verifyToken, verifyRole, getAllUsers);
router.get('/get/user/:id', verifyToken, getUserById),
router.put('/update/user/:id', verifyToken, updateUser);
router.delete('/delete/user/:id', verifyToken, verifyRole, deleteUser);

module.exports = router;