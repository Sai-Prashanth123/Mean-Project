const mongoose = require('mongoose');
const moment = require('moment');

const Model = mongoose.model('Invoice');

const revenueChart = async (req, res) => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const m = moment().subtract(i, 'months');
    months.push({ label: m.format('MMM YYYY'), start: m.startOf('month').toDate(), end: m.clone().endOf('month').toDate() });
  }

  const results = await Promise.all(
    months.map(async ({ label, start, end }) => {
      const agg = await Model.aggregate([
        {
          $match: {
            removed: false,
            date: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$total' },
            paid: { $sum: '$credit' },
            count: { $sum: 1 },
          },
        },
      ]);
      return {
        month: label,
        revenue: agg[0]?.revenue || 0,
        paid: agg[0]?.paid || 0,
        invoices: agg[0]?.count || 0,
      };
    })
  );

  return res.status(200).json({
    success: true,
    result: results,
    message: 'Revenue chart data fetched successfully',
  });
};

module.exports = revenueChart;
