const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')


const app = express();
const port = process.env.PORT;

// const multer = require('multer')
// const upload = multer({
//     dest:'images',
//     limits:{
//         fileSize:5000000
//     },
//     fileFilter(req,file,cb){

//         // if (!file.originalname.endsWith('.pdf')){
//         //     return cb(new Error('Please upload PDF'))
//         // }
//         if (!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please upload Document'))
//         }
//         // cb(new Error('File must be pdf'))
//          cb(undefined,true)
//         // cb(undefined,false)
//     }
// })

// app.post('/upload', upload.single('upload') ,  (req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
//     res.status(400).send({error:error.message})
// })



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port , ()=>{
    console.log('server is up on port ' + port)
})
const bcrypt = require('bcryptjs')

const myFunction = async()=>{
    const password = "Red1234!"
    const hashedPassword = await bcrypt.hash(password,8)
    console.log(password)
    console.log(hashedPassword)

    const isMatch = await bcrypt.compare('Red1234!',hashedPassword)
    console.log(isMatch)
}
myFunction()

const pet = {
    name:'hal'
}

pet.toJSON = function(){
    console.log(this)
    return this
}
console.log(JSON.stringify(pet))

const Task = require('./models/tasks')
const User = require('./models/user')

// const main = async ()=>{
//     // const task = await Task.findById('61370f834af23bc1bb8009a2')
//     // await task.populate('owner')
//     // console.log(task.owner)

//     const user = await User.findById('61370e939c6d05ca4b8cb47a')
//     await user.populate('tasks')
//     console.log(user.tasks)

// }
// main()

