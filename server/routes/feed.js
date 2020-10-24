const express = require('express');
const { getPosts, createPost } = require('../controllers/feedContollers');

const router = express();

router.get('/feed/posts', getPosts);

router.post('/post', createPost);

module.exports = router;