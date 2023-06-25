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

exports.getEntireAgenda = async function (req, res) {
    try {
      const agendaItems = await AgendaItem.find({ user: req.user._id });
      console.log(agendaItems);
      res.json(agendaItems);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  