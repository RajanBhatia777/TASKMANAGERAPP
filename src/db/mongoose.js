const mongoose=  require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,

})

// const User = mongoose.model('User',{
//     name:{
//         type:String
//     },
//     age:{
//         type:Number

//     }
// })

// const me = new User({
//     name:'Rajan',
//     age:23
// })

// me.save().then(()=>{
//     console.log(me);
// }).catch((error)=>{
//     console.log('errorrr!!!1..',error)
// })

// const Task = mongoose.model('Task',{
//     name:{
//         type:String
//     },
//     age:{
//         type:Number
//     },
//     phone:{
//         type:Number
//     }
// })

// const myTask = new Task({
//     name:"Rajan",
//     age:23,
//     phone:8295501695
// })
// myTask.save().then(()=>{
//     console.log(myTask)
// }).catch((error)=>{
//     console.log('errrooorrrr!!!..',error)
// })