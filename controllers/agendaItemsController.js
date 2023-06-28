const AgendaItem = require('../models/agendaItem');
const User = require('../models/user');
const moment = require('moment');


exports.createAgendaItem = async function (req, res) {
  try {
    if (req.user.isLoggedIn) {
      req.body.user = req.user._id;
      req.body.dateAndStartTime = moment(req.body.dateAndStartTime).format('YYYY-MM-DD HH:mm');
      req.body.dateAndEndTime = moment(req.body.dateAndEndTime).format('YYYY-MM-DD HH:mm')
      
      if (
        await AgendaItem.findOne({
          dateAndStartTime: req.body.dateAndStartTime,
          dateAndEndTime: req.body.dateAndEndTime,
        })
      ) {
        res.status(401).json({
          message: 'An agenda item with this date, start time, and finish time already exists!'
        });
      } else {
      
        const agendaItem = await AgendaItem.create(req.body);
        req.user.agendaItems.addToSet(agendaItem._id);
        await req.user.save();
        res.json(agendaItem);
      }
    } else {
      res.status(401).json({ message: 'Log back in!' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAgendaItem = async function (req, res){
  try{
      if (req.user.isLoggedIn) {
      const agendaItem = await AgendaItem.findOne({ _id: req.params.id })
      res.json(agendaItem)
  }else {
      res.status(401).json({message:'Log back in!'})
  }
  } catch(error){
      res.status(400).json({ message: error.message })
  }
}




exports.getEntireAgenda = async (req, res) => {
  try {
      if (req.user.isLoggedIn) {
      const agendaItems = await AgendaItem.find({ user: req.user._id})
      res.json(agendaItems)
  } else {
      res.status(401).json({message:'Log back in!'})
  }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
  
  exports.updateAgendaItem = async function(req, res){
    try{
        if (req.user.isLoggedIn) {
          if (await AgendaItem.findOne({date: req.body.date, startTime: req.body.startTime, finishTime: req.body.finishTime})){
            res.status(401).json({message:'An agenda item with this date, start time, and finish time already exists!'})
          } else {
        const agendaItem = await AgendaItem.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        res.json(agendaItem)
          }
    }  else {
        res.status(401).json({message:'Log back in!'})
    }
    } catch(error){
        res.status(400).json({ message: error.message })
    }
}

exports.deleteAgendaItem = async function(req, res) {
    try {
        if (req.user.isLoggedIn) {
            await AgendaItem.findOneAndDelete({_id: req.params.id})
            const index = req.user.agendaItems.indexOf(req.params.id)
            req.user.agendaItems.splice(index, 1)
            await req.user.save()      
            res.status(200).json({message: 'Agenda item sucessfully deleted'})

        } else {
            res.status(401).json({message: error.message})
        }
    } catch(error) {
        res.status(400).json({message: error.message})
    }
}
