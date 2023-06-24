const AgendaItem = require('../models/agendaItem')
const User = require('../models/user')

exports.create = async function (req, res){
    try {
        req.body.user = req.user._id
        const agendaItem = await AgendaItem.create(req.body)
        console.log(req.user)
        req.user.agendaItems.addToSet(agendaItem._id )
        await req.user.save()
        res.json(agendaItem)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}