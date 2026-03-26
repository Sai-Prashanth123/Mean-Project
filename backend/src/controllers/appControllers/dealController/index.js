const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const Deal = require('@/models/appModels/Deal');

const methods = createCRUDController('Deal');

methods.moveStage = async (req, res) => {
  const { stage } = req.body;
  const validStages = ['lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost'];
  if (!validStages.includes(stage)) {
    return res.status(400).json({ success: false, message: 'Invalid stage' });
  }
  const deal = await Deal.findByIdAndUpdate(
    req.params.id,
    { stage, updated: Date.now() },
    { new: true }
  ).populate('client');
  if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
  return res.json({ success: true, result: deal });
};

module.exports = methods;
