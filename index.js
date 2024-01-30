const express = require('express');
const connectDB = require('./utils/connectDB');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();

const userRoutes = require('./routes/user')

const app = express();

connectDB()
app.use(bodyParser.json())

app.use('/api/v1', userRoutes)

app.get('/', (req, res) => {
    res.json({
        "Message": "Hello from backend"
    })
})


const port = process.env.PORT || 5000

app.listen(port, ()=>{
    console.log("connected at port "+port);
})