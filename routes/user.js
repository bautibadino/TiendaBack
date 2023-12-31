const User = require('../models/User');
const { 
    verifyToken, 
    verifyTokenAndAutorization, 
    verifyTokenAndAdmin } = require('./verifyToken');
const router = require('express').Router();

//UPDATE USER
router.put('/:id', verifyTokenAndAutorization, async (req, res) => {
    if(req.body.password) {
        req.body.password = CryptoJs.AES.encrypt(
            req.body.password,
            process.env.PASSWORD_SEC
        ).toString();

    }
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            }, 
            { new: true }
        );
        res.status(200).json(updatedUser);
    }catch(err) {   
        res.status(500).json(err);
    }
});
//DELETE METHOD
router.delete('/:id', verifyTokenAndAutorization, async(req,res)=>{
    try{
        await User.findOneAndDelete(req.params.id)
        res.status(200).json('user deleted')
    }
    catch(err){
        res.status(500).json(err)
    }
})
//GET USER
router.get('/find/:id', verifyTokenAndAdmin, async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const { password , ...others} = user._doc;
        
        res.status(200).json(others)
    }
    catch(err){
        res.status(500).json(err)
    }
})
//GET ALL USERS
router.get('/', verifyTokenAndAdmin, async(req,res)=>{
    const query = req.query.new;
    try{
        const users = query
        ? await User.find().sort({_id: -1}).limit(5)
        : await User.find()        
        res.status(200).json(users)
    }
    catch(err){
        res.status(500).json(err)
    }
})
//USER STATS
router.get('/stats', verifyTokenAndAdmin, async (req,res) =>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try{
        const data = await User.aggregate([
            {$match: {createdAt:{$gte: lastYear}}},
            {
                $project: {
                    month:{
                        $month: '$createdAt',
                    },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1},
                },
            },
        ])
        res.status(200).json(data)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;