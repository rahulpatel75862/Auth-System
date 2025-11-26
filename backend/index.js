const express = require('express');
const dotenv = require('dotenv');
const { connectDb } = require('./db/db');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

connectDb();
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})