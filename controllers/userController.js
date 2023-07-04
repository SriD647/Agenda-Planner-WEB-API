require('dotenv').config()
const User = require('../models/user')
const AgendaItem = require('../models/agendaItem')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { deleteOne } = require('../models/agendaItem')


exports.auth = async (req, res, next) => {//authorizing the user
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.SECRET)
    const user = await User.findOne({ _id: data._id })
    if (!user ) {
      throw new Error()
    }
    req.user = user
    next()
  } catch (error) {
    res.status(401).send({message: 'Not authorized'})
  }
}

exports.createUser = async (req, res) => {
  try {
    if (!await User.findOne({ email: req.body.email})) {
    const user = new User(req.body)
    user.isLoggedIn = false
    await user.save()
    res.json({user})
  }  else throw Error ("A user with that email already exists!")
  } catch (error) {
    res.status(400).json({message: error.message} )
  }
  console.log(typeof req.body.password);
}


exports.loginUser = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email })
      if(!user || !await bcrypt.compare(req.body.password, user.password)){
         throw new Error('Incorrect Login Credentials')
      }      
      else {
            const token = await user.generateAuthToken()
            res.json({ user, token })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.getUser = async (req, res) => {
  try { 
    const user = await User.findOne({ _id: req.params.id })
    if (user) {
    res.json(user) 
    } else res.status(400).json({ message: "No user exists with such id" })
  } catch (error) {
      res.status(400).json({ message: "No user exists with such id" })
  }
}

exports.updateUser = async (req, res) => {
    try {

      if (!await User.findOne({ email: req.body.email})) {
        if (req.user.isLoggedIn) {
              const updates = Object.keys(req.body)
              updates.forEach(update => req.user[update] = req.body[update])
              await req.user.save()
              res.json(req.user)
            } else {
              res.status(400).json({ message: 'Log back in!' })
            }
        } else throw Error ("A user with that email already exists!")
      }
        catch (error) {
          res.status(400).json({ message: error.message })
    } 
}

exports.deleteUser = async (req, res) => {
    try {
      if(req.user.isLoggedIn){
      await AgendaItem.deleteMany({ user: req.user._id });  
      await req.user.deleteOne()      
      res.status(200).json({message: 'User successfully deleted'})
  }else {
    res.status(400).json({ message: "Log back in!" })
      }
    } catch (error) {
      res.status(401).json({ message: error.message })
    }
  }

  exports.logoutUser = async (req, res) => {
    try {
      req.user.isLoggedIn = false
      await req.user.save()
      res.status(200).json({message: "User logged out successfully!"})
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }