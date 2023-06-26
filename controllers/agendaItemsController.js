const AgendaItem = require('../models/agendaItem')
const User = require('../models/user')

exports.create = async function (req, res){
    try {
      if (req.user.isLoggedIn) {
      req.body.user = req.user._id
      const agendaItem = await AgendaItem.create(req.body)
      req.user.agendaItems.addToSet(agendaItem._id )
      console.log(req.user)
      await req.user.save()
      res.json(agendaItem)
      } else {
        res.status(401).json({message:'Log back in!'})
    }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

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
        const agendaItems = await AgendaItem.find({ user: req.params.id})
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
        const agendaItem = await AgendaItem.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        res.json(agendaItem)
    }  else {
        res.status(401).json({message:'Log back in!'})
    }
    } catch(error){
        res.status(400).json({ message: error.message })
    }
}

// exports.deleteAgendaItem = async function(req, res) {
//     try {
//         if (req.user.isLoggedIn) {
            
//             await User.agendaItem.findOneAndDelete({_id: req.params.id })
//             await AgendaItem.findOneAndDelete({_id: req.params.id})
//             res.status(200).json({message: 'Agenda item sucessfully deleted'})

//         } else {
//             res.status(401).json({message: error.message})
//         }
//     } catch(error) {
//         res.status(400).json({message: error.message})
//     }
// }

exports.deleteAgendaItem = async function(req, res) {
    try {
      if (req.user.isLoggedIn) {
        const userId = req.user._id;
        const agendaItemId = req.params.id;
  
        // Remove the agenda item from the user's agendaItems array
        const user = await User.findOneAndUpdate(
          { _id: userId },
          { $pull: { agendaItems: agendaItemId } },
          { new: true }
        );
  
        if (user) {
          await AgendaItem.findOneAndDelete({ _id: agendaItemId });
          res.status(200).json({ message: 'Agenda item successfully deleted' });
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      } else {
        res.status(401).json({ message: 'User not logged in' });
      }
    } catch(error) {
      res.status(400).json({ message: error.message });
    }
  }
  
  
  
  