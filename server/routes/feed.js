const express = require('express');
const { body } = require('express-validator/check')
const { getPosts, createPost, deletePost, editPost, getPost } = require('../controllers/feedContoller');

const router = express();

const validations = [
    body('title',
    'Title is too short and/or Blank'
    ).trim()
    .isLength({ min: 5 })
    .isString(),
    body('content',
    'Description is too short and/or Blank'
    ).isLength({ min: 5, max: 400 })
    .trim()
]

router.get('/feed/post/:postId', getPost);
router.get('/feed/posts', getPosts);

router.post('/post', validations, createPost);
router.put('/edit-post/:postId', validations, editPost);
router.delete('/delete-post/:postId', deletePost);


module.exports = router;