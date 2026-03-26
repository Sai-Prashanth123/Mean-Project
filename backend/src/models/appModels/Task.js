const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'overdue'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['call', 'email', 'meeting', 'follow_up', 'other'],
    default: 'other',
  },
  linkedEntity: { type: String, enum: ['client', 'lead', 'deal'] },
  linkedId: { type: mongoose.Schema.ObjectId },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

taskSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Task', taskSchema);
