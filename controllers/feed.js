const expressValidator = require('express-validator');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: 1,
            title: 'First Post',
            content: 'This is my first post !',
            imageUrl: 'images/car.jpg',
            creator: {
                name:'Shashank Biplav'
            },
            createdAt: new Date(),
        }]
    });
};

exports.createPost = (req, res, next) => {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message:'Validation failed, entered data is not valid',
            errors: errors.array()
        });
    }
    const title = req.body.title;
    const content = req.body.content;
    //TODO: create post in DB
    res.status(201).json({
        message: 'Post created successfully',
        post: {
            _id: new Date().toISOString(),
            title: title,
            content: content,
            creator:{
                name: 'Shashank Biplav'
            },
            createdAt: new Date()
        }
    });
};
