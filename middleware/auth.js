const jwt = require('jsonwebtoken');
const User = require('../model/user');

const auth = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized - Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Missing Bearer token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden - Invalid token' });
    }
    const user = await User.findById(decoded.user_id); // Assuming user_id is the key in the decoded object
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  });
};

module.exports = auth;