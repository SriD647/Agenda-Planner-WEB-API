const express = require('express')
const router = express.Router()
const agendaItemsController = require('../controllers/agendaItemsController')
const userController = require('../controllers/userController')


// Create agendaItem
router.post('/', userController.auth, agendaItemsController.create)


module.exports = router 