const expressValidator = require('express-validator');

const Post = require('../models/post.js');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: 1,
            title: 'First Post',
            content: 'This is my first post !',
            imageUrl: 'images/car.jpg',
            creator: {
                name: 'Shashank Biplav'
            },
            createdAt: new Date(),
        }]
    });
};

exports.createPost = (req, res, next) => {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed, entered data is not valid',
            errors: errors.array()
        });
    }
    const title = req.body.title;
    const content = req.body.content;
    //TODO: create post in DB
    const post = new Post({
        title: title,
        content: content,
        imageUrl: 'images/car.jpg',
        creator: {
            name: 'Shashank Biplav'
        },
    });
    post.save()
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message: 'Post created successfully',
            post: result
        });
    })
    .catch((err) => {
        console.log(err);
    });
};