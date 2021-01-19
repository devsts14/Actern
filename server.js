const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDb = require('./database/db');
const path = require('path');
require('dotenv').config();

const app = express();

// connect database(mongodb)
connectDb();

app.use(morgan('dev'));
app.use(bodyParser.json());

// import routes
const authRoutes = require('./routes/api/auth');
const profileRoutes = require('./routes/api/profile');
const postRoutes = require('./routes/api/post');

// middleware
app.use('/api', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/post', postRoutes);


if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));
  app.get('*',(req, res)=>{
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

// Setup Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port:${PORT}`));
