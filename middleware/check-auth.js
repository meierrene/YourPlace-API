const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) throw new Error('Authentication failed');
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch {
    return next(new HttpError('Authentication failed', 403));
  }
};
