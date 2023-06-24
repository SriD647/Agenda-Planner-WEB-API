const { model, Schema } = require('mongoose')

const agendaItemSchema = new Schema ({
    title: { type: String, required: true },
    description: String,
    dueDate: { type: Date, required: true },//YYYY-MM-DD
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }

})

const AgendaItem = model('AgendaItem', agendaItemSchema)

module.exports = AgendaItem