const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const Task = require('@/models/appModels/Task');

const methods = createCRUDController('Task');

methods.complete = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: 'completed', updated: Date.now() },
    { new: true }
  );
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  return res.json({ success: true, result: task });
};

methods.overdueCount = async (req, res) => {
  const now = new Date();

  // Auto-mark overdue: pending tasks past dueDate
  await Task.updateMany(
    { status: 'pending', dueDate: { $lt: now }, removed: false },
    { status: 'overdue', updated: now }
  );

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [overdue, pending, dueToday] = await Promise.all([
    Task.countDocuments({ status: 'overdue', removed: false }),
    Task.countDocuments({ status: 'pending', removed: false }),
    Task.countDocuments({ status: 'pending', dueDate: { $gte: today, $lt: tomorrow }, removed: false }),
  ]);

  return res.json({ success: true, result: { overdue, pending, dueToday } });
};

module.exports = methods;
