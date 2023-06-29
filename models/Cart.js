const mongoose = require('mongoose'); 

const ProductScheema = new mongoose.Schema({
    UserId: {
        type: String,
        required: true,
    },
    products: [
        {
            productId:{
                type:String
            },
            quantity:{
                type:Number
            }
        }
    ],
}, {timestamps: true})

module.exports = mongoose.model('User', UserScheema);