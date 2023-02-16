const jwt=require("jsonwebtoken")
const secretKey = process.env.SECRET_KEY;


const checkToken = (req, res, next) => {
    
    //get token from req obj header
    let tokenWithBearer=req.headers.authorization;
    
    let token;

    //if token not existed
    if(tokenWithBearer===undefined){
        return res.send({message:"Unauthorized access"})
    }
    //if token is existed,verify
    else{
        token=tokenWithBearer.split(" ")[1];
        jwt.verify(token,secretKey ,(err,decoded)=>{
            if(err){
                console.log(err)
                return res.send({message:"Session expired..login to continue..."})
            }
            else{
                next()
            }

        })
    }
}
module.exports = checkToken;