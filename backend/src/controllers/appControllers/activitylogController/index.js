const mongoose = require('mongoose');

const ActivityLog = mongoose.model('ActivityLog');

const list = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;

  const results = await ActivityLog.find({ removed: false })
    .sort({ created: -1 })
    .limit(limit)
    .lean();

  return res.status(200).json({
    success: true,
    result: results,
    pagination: { total: results.length },
    message: 'Activity feed fetched successfully',
  });
};

module.exports = { list };
