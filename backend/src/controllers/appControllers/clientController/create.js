const mongoose = require('mongoose');
const logActivity = require('@/helpers/activityLogger');

const Model = mongoose.model('Client');

const create = async (req, res) => {
  req.body['createdBy'] = req.admin._id;
  req.body['enabled'] = true;

  const result = await new Model(req.body).save();

  logActivity({
    type: 'client_added',
    entity: 'client',
    entityId: result._id,
    description: `New client ${result.name} added`,
    clientName: result.name,
    adminId: req.admin._id,
  });

  return res.status(200).json({
    success: true,
    result,
    message: 'Client created successfully',
  });
};

module.exports = create;
