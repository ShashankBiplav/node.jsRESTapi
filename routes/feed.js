const express = require('express');

const expressValidator = require('express-validator');

const feedController = require('../controllers/feed.js');

const router = express.Router();
// GET /feed/posts
router.get('/posts', feedController.getPosts);

//POST /feed/post
router.post('/post',[
    expressValidator.check('title').trim().isLength({min:5}),
    expressValidator.check('content').trim().isLength({min:5})
], feedController.createPost);

router.get('/post/:postId', feedController.getPost);

router.put('/post/:postId', [
    expressValidator.check('title').trim().isLength({min:5}),
    expressValidator.check('content').trim().isLength({min:5})
], feedController.updatePost);

module.exports = router;