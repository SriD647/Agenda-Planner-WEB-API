require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({

    name:{type:String, required: true, match: /^[A-Za-z]+(?: [A-Za-z]+)?$/},
    email:{type:String, required: true, unique:true, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/},
    password:{type:String, required: true, match:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()-_=+[\]{};:'",.<>/?]+$/},
    isLoggedIn: Boolean,
    agendaItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgendaItem'}]
})

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function(next){
  this.isModified('password')? 
  this.password = await bcrypt.hash(this.password, 8):
  null;
  next()
})

userSchema.methods.generateAuthToken = async function(){
  this.isLoggedIn = true
    await this.save()
  const token = jwt.sign({_id:this._id}, process.env.SECRET) //{ expiresIn: '5m' }//)
  this.token = token
  return token
}

const User = mongoose.model('User',userSchema)
module.exports = User;
