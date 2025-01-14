const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logAction = require("../utils/logService");


const verifyToken = (req, res, next) => {
  
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'JWT_SECRET is not defined' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const verifyRole = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      await logAction("User Role Authentication", null, "User Role Authentication Failed Due to Missing of User ID", "failure");
      return res.status(400).json({ message: 'User ID is missing from the request' });
    }

    const user = await User.findOne({
      where: { id: userId },
      attributes: ['role'],
    });

    if (!user) {
      await logAction("User Role Authentication", userId, "User Role Authentication Failed Due to User Not Found", "failure");
      return res.status(404).json({ message: 'User not found' });
    }

    const allowedRoles = ['admin', 'uniAdmin', 'alumni'];
    if (!allowedRoles.includes(user.role)) {
      await logAction("User Role Authentication", userId, "User Role Authentication Failed Due to Insufficient Permissions", "failure");
      return res.status(403).json({ message: 'Access denied. Insufficient permissions' });
    }

    next();
  } catch (error) {
    await logAction("User Role Authentication", null,`User Role Authentication Failed Due to ${error.message}`, "failure");
    return res.status(500).json({ message: 'Failed to verify role', error: error.message });
  }
};


const verifyIsAdmin = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      await logAction("User Role Authentication", null, "User Role Authentication Failed Due to Missing of User ID", "failure");
      return res.status(400).json({ message: 'User ID is missing from the request' });
    }

    const user = await User.findOne({
      where: { id: userId },
      attributes: ['role'],
    });

    if (!user) {
      await logAction("User Role Authentication", userId, "User Role Authentication Failed Due to User Not Found", "failure");
      return res.status(404).json({ message: 'User not found' });
    }

    const allowedRoles = ['admin'];
    if (!allowedRoles.includes(user.role)) {
      await logAction("User Role Authentication", userId, "User Role Authentication Failed Due to Insufficient Permissions", "failure");
      return res.status(403).json({ message: 'Access denied. Insufficient permissions' });
    }

    next();
  } catch (error) {
    await logAction("User Role Authentication", null,`User Role Authentication Failed Due to ${error.message}`, "failure");
    return res.status(500).json({ message: 'Failed to verify role', error: error.message });
  }
};

module.exports = { verifyToken, verifyRole, verifyIsAdmin };
