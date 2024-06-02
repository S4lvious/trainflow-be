const jwt = require('jsonwebtoken');
const env = require('dotenv').config();

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'NOT AUTHENTICATED' });
    }
    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'NOT AUTHORIZED' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateJWT;
