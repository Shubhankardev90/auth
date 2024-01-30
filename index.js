const express = require('express');
const connectDB = require('./utils/connectDB');
const dotenv = require('dotenv').config();
const app = express();

connectDB()

app.get('/', (req, res) => {
    res.json({
        "Message": "Hello from backend"
    })
})


const port = process.env.PORT || 5000

app.listen(port, ()=>{
    console.log("connected at port "+port);
})