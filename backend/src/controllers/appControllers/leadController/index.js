const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const Lead = require('@/models/appModels/Lead');
const Client = require('@/models/appModels/Client');

const methods = createCRUDController('Lead');

methods.convert = async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
  if (lead.status === 'converted') {
    return res.status(400).json({ success: false, message: 'Lead already converted' });
  }

  const client = await Client.create({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    enabled: true,
    createdBy: req.admin._id,
  });

  lead.status = 'converted';
  lead.convertedToClient = client._id;
  await lead.save();

  return res.json({ success: true, result: { lead, client }, message: 'Lead converted to client' });
};

module.exports = methods;
