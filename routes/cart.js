const router = require('express').Router();
const Cart = require('../models/Cart');
const { verifyToken, verifyTokenAndAutorization, verifyTokenAndAdmin } = require('./verifyToken');


module.exports = router;

//CREATE CART
router.post('/', verifyToken , async (res, req)=>{
    const newCart = new Cart(req.body);
    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    }catch(err){
        res.status(500).json(err)
    }
});

//UPDATE CART
router.put('/:id', verifyTokenAndAutorization, async (req,res) =>{
    try{
    const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },{new:true}
        );
    }catch(err){
        res.status(500).json(err)
    }
})

//DELETE CART

router.delete('/:id', verifyTokenAndAutorization, async (req,res) =>{
    try{
        const cart = await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err)
    }
})

//GET USER CART

router.get('/find/:userId', verifyTokenAndAutorization, async (req,res)=>{
    try{
        const cart = await Cart.findOne({
            userId: req.params.userId
        });
        res.status(200).json(Cart)
    }catch(err){
        res.status(500).json(err)
    }
})

//GET ALL CARTS BY ADMIN

router.get('/', verifyTokenAndAdmin, async (res , req)=>{
    try{
        const carts = await Cart.find();
        res.status(200).json(carts);

    }catch(err){
        res.status(500).json(err);
    }
});