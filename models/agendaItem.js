const { model, Schema } = require('mongoose');

const agendaItemSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    startDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    endDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    startTime: { type: String, required: true, match: /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/ },
    endTime: { type: String, required: true, match: /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/ },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});
  
const AgendaItem = model('AgendaItem', agendaItemSchema);

module.exports = AgendaItem;
