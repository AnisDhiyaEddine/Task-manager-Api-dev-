require('../src/db/mongoose');
const Task = require('../src/models/task');

/*
Task.findByIdAndDelete("5e0b13fd38de5f11d8f37acd").then((task)=>{
    console.log(task);
    return Task.countDocuments({});
}).then((count)=>{
console.log(count);
}).catch((e)=>{
    console.log(e);
})
*/

const deleteTask = async (id)=>{
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed : false});
    return count;
}

deleteTask("5e0c7f6f5fa0be27639a1e56").then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e);
})