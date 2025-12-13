const express = require('express');
const { getAllPosts, getPostById, createPost, updatePost, deletePost } = require('../controllers/postcontroller');
const { verifyToken } = require('../middlewares/authMiddlewares');
const router = express.Router();

router.get('/get/all/posts', getAllPosts);
router.get('/get/post/:id', verifyToken, getPostById);
router.post('/create/post', verifyToken, createPost);
router.put('/update/post/:id', verifyToken, updatePost);
router.delete('/delete/post/:id', verifyToken, deletePost);


module.exports = router;