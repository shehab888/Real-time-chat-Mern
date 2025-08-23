const httpStatus=require('../utils/httpStatus')
const isAdmin=async()=>{
    try{
        const user = req.user
        if(!user){
            return res.status(404).json({status:httpStatus.FAIL,message:"no user found"})
        }
        
    }catch(error){
        return res.status(500).json({status:httpStatus.ERROR,message:error.message})
    }
}
module.exports=isAdmin


//? still not completed