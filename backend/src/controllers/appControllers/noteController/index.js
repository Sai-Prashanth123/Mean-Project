const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const Note = require('@/models/appModels/Note');

const methods = createCRUDController('Note');

methods.byEntity = async (req, res) => {
  const { entity, id } = req.query;
  if (!entity || !id) {
    return res.status(400).json({ success: false, message: 'entity and id required' });
  }
  const notes = await Note.find({ linkedEntity: entity, linkedId: id, removed: false })
    .sort({ created: -1 })
    .populate('createdBy', 'name surname');
  return res.json({ success: true, result: notes });
};

module.exports = methods;
