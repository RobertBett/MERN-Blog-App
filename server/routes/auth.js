const express = require('express');
const { check, body } = require('express-validator/check');
const { postSignup, postLogin } = require('../controllers/authController');
const User = require('../models/User');

const router = express();

const validations = { 
    loginValidations :[
        check('email')
        .isEmail()
        .withMessage('Please enter a Valid Email')
        .normalizeEmail(),
        body('password',
        'Please enter a valid Password'
        ).isLength({ min: 5 }).isAlphanumeric()
    ], 
    signupValidations :[
        check('email')
        .isEmail()
        .withMessage('Please enter a Valid Email')
        .custom(( email, { req })=>{
            return User.findOne({ email })
            .then((result) => {
                if(result) return Promise.reject('Email Already Exists Try Signing in!');
            })
        }).normalizeEmail(),
        check('userName')
        .trim()
        .isLength({min:3})
        .withMessage('Please enter longer Username')
        .custom(( userName, { req })=>{
            return User.findOne({ userName })
            .then((result) => {
                if(result) return Promise.reject('User Name Already Exists Try Another One!');
            })
        }).normalizeEmail(),
        body('firstName',
        'Please enter a valid firstName'
        ).isLength({ min: 1 }).isAlphanumeric(),
        body('lastName',
        'Please enter a valid Password'
        ).isLength({ min: 1 }).isAlphanumeric(),
        body('password',
        'Please enter a valid Password'
        )
        .trim()
        .isLength({ min: 5 }).isAlphanumeric(),
        body('confirmPassword')
        .custom((value, { req }) =>{
            console.log(req.body.password, value != req.body.password);
            if(value != req.body.password){
                return Promise.reject('Passwords do not match!')
            }
            return true
        })
    ]
}

router.post('/auth/signup', validations.signupValidations, postSignup );
router.post('/login', validations.loginValidations, postLogin );




module.exports = router;