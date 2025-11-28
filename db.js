const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId

// creating the schema // creating a structure of the data u gonna add
const User = new Schema({  
    username: {type: String , unique: true},
    password: String,
    name : String 
}) ;


const Todo = new Schema({
    description : String ,
    done : Boolean,
    userId : ObjectId
})


//creating a model so u can use it on ur index file and save the data in mongodb

const UserModel = mongoose.model('users',User);// helps u put data into the mongodb data base where users i the collection in which u wanna put ur data and the User is ur schema 
const TodoModel = mongoose.model('todos',Todo);


//exporting the variable so u can use it in index.js file to put data init
module.exports = {
    UserModel : UserModel,
    TodoModel : TodoModel
}
