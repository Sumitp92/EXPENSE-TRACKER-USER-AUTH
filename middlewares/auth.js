const jwt = require('jsonwebtoken');
const User = require('../model/auth');
const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';


const authenticate = (req, res, next) => {

    const token = req.headers['authorization']?.split(' ')[1]; 


    if (!token) {

        return res.status(401).json({ success: false, message: 'No token provided' });

    }


    jwt.verify(token, JWT_SECRET, (err, decoded) => {

        if (err) {

            return res.status(403).json({ success: false, message: 'Failed to authenticate token' });

        }


        req.user = { id: decoded.userId };

        next();

    });

};


module.exports = { authenticate };