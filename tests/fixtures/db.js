const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')


 
const userId = new mongoose.Types.ObjectId()
const userOne = {  
    _id:userId,
    name:"test",
    email:'anistifon@gmail.com',
    password:"pass777",
    tokens:[{
        token:jwt.sign({_id:userId},process.env.JWT_SECRET)
    }]
}

const setupDatabase = async()=>{
    await User.deleteMany();
    await new User(userOne).save();
}


module.exports={userId,setupDatabase,userOne}