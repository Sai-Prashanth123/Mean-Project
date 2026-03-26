const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  title: { type: String, required: true },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    autopopulate: true,
  },
  value: { type: Number, default: 0 },
  stage: {
    type: String,
    enum: ['lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost'],
    default: 'lead',
  },
  probability: { type: Number, min: 0, max: 100, default: 10 },
  expectedCloseDate: { type: Date },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

dealSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Deal', dealSchema);
