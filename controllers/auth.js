const expressValidator = require('express-validator');

const bcrypt = require('bcryptjs');

const User = require('../models/user.js');

exports.signup = (req, res, next) => {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPwd => {
            const user = new User({
                email: email,
                password: hashedPwd,
                name: name
            });
            return user.save();
        })
        .then(user =>{
            res.status(201).json({
                message: 'User Created',
                userId: user._id
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};