const express = require('express')
const morgan = require('morgan')
const userRoutes = require('./routes/users')
const agendaItemRoutes = require('./routes/agendaItems')
const app = express()

app.use(express.json())
app.use(morgan('combined'))
app.use('/users', userRoutes)
app.use('/agendaItems', agendaItemRoutes)

module.exports = app