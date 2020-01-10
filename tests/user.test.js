const app = require('../src/app');
const request = require('supertest');
const User = require('../src/models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')




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


beforeEach(async()=>{
await User.deleteMany();
const user = await new User(userOne);
await user.save()

})

test('Signup a new user',async()=>{
  const response =   await request(app).post('/users').send({
        name : "AnisDhiyaEddine",
        email : "dhiaeboudiaf@gmail.com",
        password:"pass777"
    }).expect(201)

    //Assert that the database was updated
    const user =await User.findById(response.body.user._id)
    expect(user).not.toBeNull()


    //Assertions about the response
    expect(response.body).toMatchObject({
        user:{  
            name : "AnisDhiyaEddine",
            email :"dhiaeboudiaf@gmail.com"
        },
        token : user.tokens[0].token
    })

    expect(user.password).not.toBe("pass777")
})



test('Login a user',async()=>{
   const response = await request(app).post('/users/login').send({
        email : userOne.email,
        password : userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    //Assert that the token matches the 2nd token he inversed it

    expect(user.tokens[1].token).toBe(response.body.token)
}) 






test('Login failure',async ()=>{
    await request(app).post('/users/login').send({
        email: "failed@gmail.com",
        password:"Random"        
    }).expect(400)
})


test('get authenticated user',async()=>{
 await request(app).get('/users/me').set(
    "Authorization",`Bearer ${userOne.tokens[0].token}`
).send().expect(200)
})


test('shouldn"t get unauthenticated user',async()=>{
    await request(app).get('/users/me').set(
       "Authorization",`B`
   ).send().expect(401)
   })


test('delete authenticated user',async()=>{
    await request(app).delete('/users/me') 
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`).send().expect(200)
   
   //Assertion about database update
    const user = await User.findById(userId)
    expect(user).toBeNull()

})

test('unable to delete unauthenticated user',async()=>{
    await request(app).delete('/users/me') 
    .set("Authorization",`Bea`).send().expect(401)
})
 


