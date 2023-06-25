const AgendaItem = require('../models/agendaItem')
const User = require('../models/user')

exports.create = async function (req, res){
    try {
        req.body.user = req.user._id
        const agendaItem = await AgendaItem.create(req.body)
        req.user.agendaItems.addToSet(agendaItem._id )
        console.log(req.user)
        await req.user.save()
        res.json(agendaItem)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.getAgendaItem = async function (req, res){
    try{
        const agendaItem = await AgendaItem.findOne({ _id: req.params.id })
        res.json(agendaItem)
    } catch(error){
        res.status(400).json({ message: error.message })
    }
}

exports.getEntireAgenda = async (req, res) => {
    try {
    const agendaItems = await AgendaItem.find({ user: req.params.id})
    res.json(agendaItems)

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  
  exports.updateAgendaItem = async function(req, res){
    try{
        const agendaItem = await AgendaItem.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        res.json(agendaItem)
    } catch(error){
        res.status(400).json({ message: error.message })
    }
}