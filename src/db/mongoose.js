const mongoose=  require('mongoose');

const DBURL = 'mongodb+srv://taskmanager:Rajan0707@cluster1.ktqs8.mongodb.net/test?authSource=admin&replicaSet=atlas-14gkqu-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'

mongoose.connect(DBURL,{
    useNewUrlParser:true,  
})
.then(()=>{
    console.log("database connected")
})
.catch((error)=>{
    console.log("connection error:=>",error)
})

