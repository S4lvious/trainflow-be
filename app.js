const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const db = require('./db');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});