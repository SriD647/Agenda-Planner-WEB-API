const AgendaItem = require('../models/agendaItem');
const User = require('../models/user');


exports.createAgendaItem = async function (req, res) {
  try {
    req.body.user = req.user._id;
    if (!req.user.isLoggedIn) {
      res.status(401).json({ message: 'Log back in!' });
    } else if (await AgendaItem.findOne({startDate: req.body.startDate, endDate: req.body.endDate, startTime: req.body.startTime, endTime: req.body.endTime, user: req.user._id })) {
      res.status(400).json({ message: 'An agenda item with this date, start time, and finish time already exists!' });
    } else {  
    const agendaItem = await AgendaItem.create(req.body)
    req.user.agendaItems.addToSet(agendaItem._id);
    await req.user.save();
    res.json(agendaItem);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }  
};


exports.getAgendaItem = async function (req, res){
  try{
      if (req.user.isLoggedIn) {
      const agendaItem = await AgendaItem.findOne({ _id: req.params.id })
      if (!agendaItem) {
        throw Error ("User has no agenda item with such id")
      } else res.json(agendaItem)
  }else res.status(401).json({message:'Log back in!'})
  } catch(error){
    res.status(400).json({ message: "User has no agenda item with such id" })
  }
}

exports.getEntireAgenda = async (req, res) => {
  try {
      if (req.user.isLoggedIn) {
      const agendaItems = await AgendaItem.find({ user: req.user._id})
      if (agendaItems.length>0) {
      res.json(agendaItems)
      } else res.json({message: "User has no agenda items"})
  } else {
      res.status(401).json({message:'Log back in!'})
  }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.getAgendaItemsByDate = async function (req, res) {
  try{
    if (req.user.isLoggedIn) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(req.params.id)) {
        throw new Error("Invalid date format")
      }
      const agendaItems = await AgendaItem.find({ startDate: req.params.id, user: req.user._id })
      if (agendaItems.length>0) {
      res.json(agendaItems)
    } else res.json({message: "User has no agenda items on specified date"})
  } else res.status(401).json({message:'Log back in!'})
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.updateAgendaItem = async function(req, res){
    try {
      if (!req.user.isLoggedIn) {
        res.status(401).json({ message: 'Log back in!' });
      }
      else if (!await AgendaItem.findOne({ _id: req.params.id })) {
          res.status(400).json({message: 'User has no agenda item with such id'})
      } 
      else if (await AgendaItem.findOne({startDate: req.body.startDate, endDate: req.body.endDate, startTime: req.body.startTime, endTime: req.body.endTime, user: req.user._id })){
       throw new Error('User already has an agenda item with this date, start time, and finish time already exists!')
      } 
        const agendaItem = await AgendaItem.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true })
        res.json(agendaItem)
  }
  catch (error){
    res.status(400).json({message: 'User has no agenda item with such id'})
    }
}


exports.deleteAgendaItem = async function(req, res) {
    try {
        if (req.user.isLoggedIn) {
           const agendaItem= await AgendaItem.findOneAndDelete({_id: req.params.id, user: req.user._id})
           if (!agendaItem) {
            res.status(400).json({message: 'User has no agenda item with such id'})
           } 
            const index = req.user.agendaItems.indexOf(req.params.id)
            req.user.agendaItems.splice(index, 1)
            await req.user.save()      
            res.status(200).json({message: 'Agenda item sucessfully deleted'})

        } else {
          res.status(401).json({message:'Log back in!'})
        }
    } catch(error) {
      res.status(400).json({message: 'User has no agenda item with such id'})
    }
}

exports.deleteAllAgendaItems = async function(req, res) {
  try {
      if (req.user.isLoggedIn) {
          await AgendaItem.deleteMany({ user: req.user._id})
          while (req.user.agendaItems.length > 0) {
            req.user.agendaItems.pop();
          }
          await req.user.save()      
          res.status(200).json({message: 'All agenda items associated with user sucessfully deleted'})

      } else {
        res.status(401).json({message:'Log back in!'})
      }
  } catch(error) {
      res.status(400).json({message: error.message})
  }
}
