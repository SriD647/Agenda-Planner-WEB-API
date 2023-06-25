const { model, Schema } = require('mongoose');

const agendaItemSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    date: { type: String, required: true, match: /^(\d{4})-(\d{2})-(\d{2})$/ }, // YYYY-MM-DD
    startTime: { type: String, required: true, match: /^(0[1-9]|1[0-2]):([0-5][0-9] [AP]M)$/ }, // HH:MM AM/PM
    finishTime: { type: String, required: true, match: /^(0[1-9]|1[0-2]):([0-5][0-9] [AP]M)$/ }, // HH:MM AM/PM
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
});

const AgendaItem = model('AgendaItem', agendaItemSchema);

module.exports = AgendaItem;
