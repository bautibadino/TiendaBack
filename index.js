const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user') 
const authRoute = require('./routes/auth')
const productsRoute = require('./routes/products')
dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(()=> console.log('Connected to database'))
    .catch((error)=> {
        console.log(error);
    });
    
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productsRoute);

app.listen(process.env.PORT || 3000 , () => {
    console.log('Server is running on port 3000');
}) 
