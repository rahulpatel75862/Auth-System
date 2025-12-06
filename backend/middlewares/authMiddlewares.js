// middlewares/authMiddlewares.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || process.env.access_token || 'replace_with_secret';

// sign token helper
exports.signin = (user) => {
  // payload uses userId for clarity and to match other code
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// verifyToken / protect middleware
exports.verifyToken = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization || req.headers.Authorization;
    if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided. Authorization denied.' });
    }

    const token = authHeaders.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Token is not valid or expired.' });
    }

    // Attach to req.user (NOT res.user)
    req.user = {
      id: decoded.userId,
      role: decoded.role,
      email: decoded.email
    };

    next();
  } catch (error) {
    console.error('verifyToken error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// verifyRole (admin only)
exports.verifyRole = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  if (!req.user.role || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
};
