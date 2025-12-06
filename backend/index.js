const express = require('express');
const dotenv = require('dotenv');
const { connectDb } = require('./db/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const cors = require('cors');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

connectDb();

app.use(cors())
app.use(express.json());
try {
    const authRoutes = require('./routes/authRoutes');
    const userRoutes = require('./routes/userRoutes'); 
    const postRoutes = require('./routes/postRoutes'); 
  
    console.log('Route modules required successfully');
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/posts', postRoutes);
  } catch (err) {
    console.error('Error requiring routes:', err);
  }
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})