const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const workoutRouter = require('./routes/workout');
const foodRouter = require('./routes/food');

const db = require('./db');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'https://trainflow-fe-1.onrender.com/'
}));

// Routes
app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/workout', workoutRouter );
app.use('/food', foodRouter );

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
