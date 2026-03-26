const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  company: { type: String },
  source: {
    type: String,
    enum: ['website', 'referral', 'cold_call', 'email', 'social', 'other'],
    default: 'other',
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
    default: 'new',
  },
  score: { type: Number, default: 0, min: 0, max: 100 },
  notes: { type: String },
  assignedTo: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  convertedToClient: { type: mongoose.Schema.ObjectId, ref: 'Client', default: null },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

leadSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Lead', leadSchema);
