const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  type: {
    type: String,
    enum: [
      'invoice_created',
      'invoice_updated',
      'payment_received',
      'client_added',
      'quote_created',
      'quote_accepted',
    ],
    required: true,
  },
  entity: { type: String },
  entityId: { type: mongoose.Schema.ObjectId },
  description: { type: String, required: true },
  amount: { type: Number },
  currency: { type: String, default: 'USD' },
  clientName: { type: String },
  number: { type: Number },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
