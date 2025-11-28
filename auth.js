const jwt= require("jsonwebtoken");
const JWT_SECRET ="ilovemessi" ;



function auth(req,res,next){
    
    const token = req.headers.authorization;

    const response = jwt.verify(token,JWT_SECRET);
    if(response){
        req.userId = response.id;
        next();
    }else{
        res.json(403).json({
            message:"incorrect credentials"
        })
    }
}

module.exports={
    auth,
    JWT_SECRET
}