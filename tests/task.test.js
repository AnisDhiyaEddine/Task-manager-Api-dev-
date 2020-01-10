const request = require('supertest');
const {userId,userOne,setupDatabase}=require('../tests/fixtures/db.js')
const app = require('../src/app')
const Task = require('../src/models/task')
beforeEach(setupDatabase)

test('Add a task',async()=>{

    const response = await request(app).post('/tasks')
    .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
    .send({
        description :"Automated test task"
    })
    .expect(201) 

    const task = Task.findById(response.body._id)
    expect(task).not.toBeNull()
})    




