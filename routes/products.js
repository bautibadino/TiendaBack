const Product = require('../models/Product');
const { verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

//agregar producto a db
router.post('/', verifyTokenAndAdmin , async (req,res) =>{
    const newProduct = new Product(req.body); //trae productos de lo que se le pasa del body en la instancia de producto creada
    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct)
    }catch(err){
        res.status(500).json('err')
    }
})
//actualizar producto de la db

router.put('/:id',verifyTokenAndAdmin, async(req,res) =>{
    try{
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {new: true}
        )
        res.status(200).json(updatedProduct)
        console.log('modificado');
    }catch(err){
        console.log('err');
    }
})

//borrar producto db

router.delete('/:id', verifyTokenAndAdmin, async (req,res) =>{
    try{    
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json('product deleted')
    }catch(err){
        console.log(err);
    }
})

//Buscar un producto en la db

router.get('/find/:id', async ( req,res ) =>{
    try{
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    }catch(err){
        res.status(500).json(err)
    }
})

//Buscar todos los productos de la db
router.get('/', async(req,res)=>{
    const queryNew = req.query.new;
    const queryCategory = req.query.category
    try{
        
        let products;
        if(queryNew){
            products = await Product.find().sort({createdAt: -1}).limit(5)
        }else if(queryCategory){
            products = await Product.find({categories: {
                $in: [queryCategory],
            },
        });
        }else{
            products = await Product.find()
        }
        res.status(200).json(products)
    }
    catch(err){
        res.status(500).json(err)
    }
})
module.exports = router;