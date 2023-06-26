const express = require('express')
const router = express.Router()
const agendaItemsController = require('../controllers/agendaItemsController')
const userController = require('../controllers/userController')


// Create agendaItem
router.post('/new', userController.auth, agendaItemsController.create)
router.get('/:id',userController.auth, agendaItemsController.getAgendaItem)
router.get('/entireAgenda/:id',userController.auth, agendaItemsController.getEntireAgenda)
router.put('/:id',userController.auth, agendaItemsController.updateAgendaItem)
router.delete('/:id', userController.auth, agendaItemsController.deleteAgendaItem)

module.exports = router 