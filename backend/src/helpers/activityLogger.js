const mongoose = require('mongoose');

const logActivity = async ({ type, entity, entityId, description, amount, currency, clientName, number, adminId }) => {
  try {
    const ActivityLog = mongoose.model('ActivityLog');
    await ActivityLog.create({
      type,
      entity,
      entityId,
      description,
      amount,
      currency,
      clientName,
      number,
      createdBy: adminId,
    });
  } catch (err) {
    // Activity logging is non-critical — do not block the main request
    console.error('Activity log error:', err.message);
  }
};

module.exports = logActivity;
