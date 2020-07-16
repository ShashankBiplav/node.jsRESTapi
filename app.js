const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

require('dotenv').config();

const feedRoutes = require('./routes/feed.js');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json()); // for-> application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed',feedRoutes);

mongoose.connect(process.env.MONGODB_URI,{
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(result=>{
    console.log('connection successful');
    app.listen(port, ()=>{
        console.log(`Listening on port ${port}`);
    });
})
.catch(err=>console.log(err));
