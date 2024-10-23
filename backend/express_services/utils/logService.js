const Log = require('../models/Log');

const logAction = async (action, userId = null, description = '', status = 'success') => {
  try {
    await Log.create({
      action,
      userId,
      description,
      status
    });
    console.log(`Logged action: ${action} for user: ${userId}`);
  } catch (error) {
    console.error('Error logging action:', error);
  }
};

module.exports = logAction;
