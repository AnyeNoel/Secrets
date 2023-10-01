require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://0.0.0.0:27017/secretDB", {useNewUrlParser: true});

const userSchema = mongoose.Schema({
  email: String,
  password: String
});
const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});
app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const username = new User({
    email: req.body.username,
    password: req.body.password
  }
  );
  username.save().then(function(){
    res.render("secrets");
  }).catch(function(err){
    console.log(err);
  });
});
app.post("/login", function(req, res){
  const email = req.body.username;
  const password = req.body.password;
  User.findOne({email:email }).then(function(founduser){
    console.log(founduser)
    if (founduser.password === password){
      res.render("secrets");
    }
  })
});



app.listen(3000, function(){
  console.log("Server started on port 3000");
});
