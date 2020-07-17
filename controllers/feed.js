const fs = require('fs');
const path = require('path');

const expressValidator = require('express-validator');

const Post = require('../models/post.js');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalPosts;
    Post.find().countDocuments()
        .then(count => {
            totalPosts = count;
            return Post.find()
            .skip((currentPage - 1)* perPage)
            .limit(perPage);
        })
        .then(posts => {
            res.status(200).json({
                message: 'Posts Fetched Successfully.',
                posts: posts,
                totalItems :totalPosts
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createPost = (req, res, next) => {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is not valid');
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    //TODO: create post in DB
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: {
            name: 'Shashank Biplav'
        },
    });
    post.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Post created successfully',
                post: result
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found.');
                error.status = 404;
                throw error; //throwing error here in async code will reach the next catch block
            }
            res.status(200).json({
                message: 'Post Fetched',
                post: post
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error('No file picked.');
        error.statusCode = 422;
        throw error;
    }
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }
            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;
            return post.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Post updated!',
                post: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            //TODO: Check logged in user and post author
            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId)
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        message: 'Post deleted.'
                    });
                })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

//helper function to delete image
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};