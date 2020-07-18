const expressValidator = require('express-validator');

const jwt = require('jsonwebtoken');

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
        .then(user => {
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

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                const error = new Error('User with this email not found');
                eror.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => { //returned from password comparison : true or false
            if (!isEqual) {
                const error = new Error('Wrong Password');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({ // creating a JWT token
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 'yoursuperdupersecretkeythatisknownonlytoyouandtheserver', {
                expiresIn: '1h'
            });
            res.status(200).json({
                token: token,
                userId: loadedUser._id.toString()
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.getUserStatus = (req, res, next) => {
    User.findById(req.userId)
    .then(user => {
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            status: user.status
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.updateUserStatus = (req, res, next) =>{
    const newStatus = req.body.status;
    User.findById(req.userId)
    .then(user=>{
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        user.status = newStatus;
        return user.save();
    })
    .then(result=>{
        res.status(200).json({message: 'User updated successfully'});
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}