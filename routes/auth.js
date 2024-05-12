const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/getuser')

const JWT_sig = 'idontnknowwhat$thekeyis';


// Route 1 : To create user
router.post('/signup',
    [
        body('name', "invalid name").isLength({ min: 3 }),
        body('email', "invalid email").isEmail(),
        body('password', 'invalid password').isLength({ min: 5 })
    ],
    async (req, res) => {
        let success = false;
        //Check if user did any mistake in entering fields.
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({success, errors: result.array() });
        }
        //If there are errors return bad request and errors
        try {
            // Check user with this email id exists
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json({success, 'error': 'sorry a user exists with this email' })
            }

            //Create secure Password
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(req.body.password, salt);

            // Create new user
            user = await User.create({
                name: req.body.name,
                password: secPassword,
                email: req.body.email
            })
            const data = {
                id: user.id
            }
            const auth_token = jwt.sign(data, JWT_sig);
            success = true;
            res.json({success, auth_token });
            // res.json(user)
        } catch (err) {
            res.send('Some error occured');
            console.log(err)
        }
        // .then(user => res.json(user))
        // .catch(err => {
        //     res.json(err);
        //     console.log(`Error is ${err}`);
        // })
        // const user = User(req.body);
        // user.save();
        // res.send(`Hello, ${req.body.name}!`);

        // res.send(req.body);
    });


// Route 2 : Authenticate user
router.post('/login', [
    body('email', "invalid email").isEmail(),
    body('password', 'invalid password').notEmpty()
],
    async (req, res) => {
        let success = false;
        //Check if user did any mistake in entering fields.
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ success, errors: result.array() });
        }
        try {
            const { email, password } = req.body;
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ success, error: 'Pls try to login with correct credentials' });
            }
            const passCompare = bcrypt.compareSync(password, user.password);
            if (!passCompare) {
                return res.status(400).json({ success, error: 'Pls try to login with correct credentials' });
            }
            // res.send(user);
            const data = {
                id: user.id
            };
            const auth_token = jwt.sign(data, JWT_sig);
            success = true;
            res.json({ success, auth_token });
        } catch (err) {
            res.send('Some error occured');
            console.log(err)
        }
        // res.json(req.body);
    });

//Route 3: Get user 
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.userId.id;
        const user = await User.findById(userId).select('-password')
        res.send(user)
    } catch (err) {
        res.send('Some error occured');
        console.log(err);
    }
})


module.exports = router;