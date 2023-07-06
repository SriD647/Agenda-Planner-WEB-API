const express = require('express')
const router = express.Router()
const agendaItemsController = require('../controllers/agendaItemsController')
const userController = require('../controllers/userController')



// Create agendaItem
router.post('/new', userController.auth, agendaItemsController.createAgendaItem)

router.get('/entireAgenda',userController.auth, agendaItemsController.getEntireAgenda)
router.get('/:id',userController.auth, agendaItemsController.getAgendaItem)
router.get('/date/:id',userController.auth, agendaItemsController.getAgendaItemsByDate)

router.delete('/entireAgenda/clear', userController.auth, agendaItemsController.deleteAllAgendaItems)
router.put('/:id',userController.auth, agendaItemsController.updateAgendaItem)
router.delete('/:id', userController.auth, agendaItemsController.deleteAgendaItem)


module.exports = router 