const express = require("express");
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt"); // hashing library
const {UserModel,TodoModel} = require("./db"); //importing schema and models 
const {auth , JWT_SECRET} = require("./auth"); // importing auth middlewere 
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); //importing mongoose so that u can connect to the server u have created 
const { z } = require("zod");  //importing zod for input validation 

mongoose.connect("mongodb+srv://rahulkaladharan2303_db_user:2003@cluster0.qs1ewis.mongodb.net/todo-app-database");



function zodcheck(req,res,next){
    const requiredbody = z.object({
        username: z.string().min(3).max(15),
        password: z.string().min(3).max(30).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
        name: z.string().min(3).max(30)
    })
    const parsedData = requiredbody.safeParse(req.body);

    if (!parsedData.success){
        res.json({
            message: "incorrect format",
            error: parsedData.error
        })
        return 
    }else{
        res.json({
            message: "you are signed up"
        })
        next();
    }
}



app.post("/signup",zodcheck,async function(req,res){
    const username = req.body.username;
    const password = req.body.password ;
    const name = req.body.name ;

   
    errorcount = false ;
    //using try catch method so that the server dont crash even if u send a different username 
    try{ 
        const hashedpassword = await bcrypt.hash(password ,5);  //hashing the password with the salt and adding the difficulty for the hashed password 
        console.log(hashedpassword);

        await UserModel.create({
            username: username,
            password: hashedpassword,
            name: name 
        } );
    errorcount = true ;

    }catch(err){
        res.json({
            message: "username already exists.."
        })
    }
    
    if (!errorcount){
        res.json({
        message : "u r signedup bro "
    });
    }
    
})


app.post("/signin",async function(req,res){
    const username = req.body.username;
    const password = req.body.password ;
    const user = await UserModel.findOne({
        username: username 
    })

    if(!user){
        res.status(403).json({
            message: "user does not exist in our database.."
        })
        return 
    }

    const verifiedPassword = await bcrypt.compare(password,user.password); //comparing with the hashed password 

    if (verifiedPassword){
        const token  = jwt.sign({
            id : user._id.toString()
        },JWT_SECRET);
        res.json({
            message: "u r siggned in" ,
            authorization : token
        })
    }else{
        res.status(403).json({
            message: "invalid username or password "
        })
    }

})


app.post("/todo",auth, function(req,res){
    const userId = req.userId ;
    const description = req.body.description;
    const done = req.body.done ;
    TodoModel.create({
    description: description,
    done : done,
    userId : userId
    })
    res.json({
        message: "Todo created successfully"
    });
    })

app.get("/todos",auth,async function(req,res){
    const userId = req.userId ;
    const user = await TodoModel.find({
        userId
    });
    
        res.json({
            user
            
        })
    }
)


app.listen(3000);
