const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  content: { type: String, required: true },
  linkedEntity: { type: String, enum: ['client', 'lead', 'deal'], required: true },
  linkedId: { type: mongoose.Schema.ObjectId, required: true },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    autopopulate: { select: 'name surname' },
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

noteSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Note', noteSchema);
