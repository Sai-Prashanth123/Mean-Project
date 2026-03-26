const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');

const topClients = async (req, res) => {
  const results = await Model.aggregate([
    { $match: { removed: false } },
    {
      $group: {
        _id: '$client',
        totalRevenue: { $sum: '$total' },
        totalPaid: { $sum: '$credit' },
        invoiceCount: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'clients',
        localField: '_id',
        foreignField: '_id',
        as: 'clientInfo',
      },
    },
    { $unwind: { path: '$clientInfo', preserveNullAndEmpty: true } },
    {
      $project: {
        _id: 0,
        clientId: '$_id',
        name: '$clientInfo.name',
        email: '$clientInfo.email',
        totalRevenue: 1,
        totalPaid: 1,
        invoiceCount: 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    result: results,
    message: 'Top clients fetched successfully',
  });
};

module.exports = topClients;
