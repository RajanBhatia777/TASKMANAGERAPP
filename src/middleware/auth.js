const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id,'tokens.token': token })
        if(!user ){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).send({e: 'Please Authentication'})
    }

}
module.exports= auth



// app.use((req, res, next)=> {
//     if(req.method === 'GET'){
//         res.send('get rqst are disable')
//     }else{
//         next()
//     }
// })


// app.use((req,res,next)=>{
//     res.status(503).send('site is currently down check the code')
// })