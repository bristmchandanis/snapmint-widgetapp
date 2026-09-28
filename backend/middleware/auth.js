const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError'
      ? 'Session expired. Please log in again.'
      : 'Invalid or expired token.';

    return res.status(401).json({ success: false, message });
  }
};

module.exports = verifyToken;
