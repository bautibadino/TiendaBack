const router = require('express').Router();
const User = require('../models/User')
const CryptoJs = require('crypto-js')
const jsonwebtoken = require('jsonwebtoken')
// REGISTER

router.post('/register', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password, process.env.PASSWORD_SEC).toString(),
    });

    try {
        const savedUser = newUser.save();
        res.status(201).json(savedUser);
    } catch {
        res.status(500).json('error');

    }
})

// LOGIN

router.post('/login', async (req, res) => {

    try {
        const user = await User.findOne(
            { username: req.body.username }
        );
        !user && res.status(401).json('Wrong username')

        const hashedPassword = CryptoJs.AES.decrypt(
            user.password, process.env.PASSWORD_SEC
            );

        const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
        const inputPassword = req.body.password;
        originalPassword !== inputPassword && res.status(401).json('Wrong pass')
        
        const accesToken = jsonwebtoken.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            {expiresIn: '3d'}
        );
        const { password, ...others } = user._doc;
        res.status(200).json({...others, accesToken});
    } catch {
        res.status(500).json();

    }
})


module.exports = router;