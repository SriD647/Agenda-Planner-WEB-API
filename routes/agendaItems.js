const express = require('express')
const router = express.Router()
const agendaItemsController = require('../controllers/agendaItemsController')
const userController = require('../controllers/userController')


// Create agendaItem
router.post('/', userController.auth, agendaItemsController.create)
router.get('/:id',userController.auth, agendaItemsController.getAgendaItem)
router.get('/',userController.auth, agendaItemsController.getEntireAgenda)


module.exports = router 