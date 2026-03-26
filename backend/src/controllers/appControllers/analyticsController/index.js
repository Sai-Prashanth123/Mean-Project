const Deal = require('@/models/appModels/Deal');
const Lead = require('@/models/appModels/Lead');
const Task = require('@/models/appModels/Task');

const pipeline = async (req, res) => {
  const data = await Deal.aggregate([
    { $match: { removed: false } },
    {
      $group: {
        _id: '$stage',
        count: { $sum: 1 },
        value: { $sum: '$value' },
      },
    },
    { $project: { stage: '$_id', count: 1, value: 1, _id: 0 } },
  ]);
  return res.json({ success: true, result: data });
};

const leads = async (req, res) => {
  const [bySource, byStatus] = await Promise.all([
    Lead.aggregate([
      { $match: { removed: false } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
      { $project: { source: '$_id', count: 1, _id: 0 } },
    ]),
    Lead.aggregate([
      { $match: { removed: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } },
    ]),
  ]);
  return res.json({ success: true, result: { bySource, byStatus } });
};

const tasks = async (req, res) => {
  const now = new Date();
  await Task.updateMany(
    { status: 'pending', dueDate: { $lt: now }, removed: false },
    { status: 'overdue', updated: now }
  );

  const [byStatus, byType] = await Promise.all([
    Task.aggregate([
      { $match: { removed: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } },
    ]),
    Task.aggregate([
      { $match: { removed: false } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $project: { type: '$_id', count: 1, _id: 0 } },
    ]),
  ]);
  return res.json({ success: true, result: { byStatus, byType } });
};

module.exports = { pipeline, leads, tasks };
