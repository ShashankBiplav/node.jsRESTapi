const express = require('express');

const expressValidator = require('express-validator');

const User = require('../models/user.js');

const authController = require('../controllers/auth.js')

const router = express.Router();

router.put('/signup', [
    expressValidator.check('name').trim().not().isEmpty(),
    expressValidator.check('email').isEmail().withMessage('Invalid Email').custom((value, {
        req
    }) => {
        return User.findOne({
                email: value
            })
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email already exists');
                }
            })
    }).normalizeEmail(),
    expressValidator.check('password').trim().isLength({
        min: 5
    })
], authController.signup);

router.post('/login',[
    expressValidator.check('email').isEmail().normalizeEmail(),
], authController.login);

module.exports = router;