//require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const alert = require("alert");
const axios = require('axios');
const cheerio = require("cheerio");
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const app = express();
app.listen(3000);
app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const url = 'mongodb://localhost:27017/project'
mongoose.connect(url,{
	useNewUrlParser: true,
    useUnifiedTopology: true,
},err=>{
	if(err) console.log(err);
	console.log("Mongo Connected succesfully");
})

let userSchema = new mongoose.Schema({
	username:String,
	password:String,
});
let currentSchema= new mongoose.Schema({
	username:String
})
const UserVeri = new mongoose.model("UserVeri",userSchema);
const CurrTrack = new mongoose.model("Currtracks",currentSchema);

app.get("/",(req,res)=>{
	res.send(__dirname+"/index.html");
});

app.get("/userdetails",(req,res)=>{


	CurrTrack.find({}, function (err, users) {
		
		return res.json({username:users[0].username});
    });
		
	
	
	
});


app.post("/login",(req,res)=>{
	//console.log(req.body);
	
   UserVeri.findOne({username:req.body.email,password:req.body.password},async function(err,found){  
	if(!found){
			alert("Wrong Cedentials!!");
			let d = {"status":400};
			return res.json(d);	
		}
		 else{
			 let doc = await CurrTrack.findOneAndUpdate({}, {username:req.body.email});
			 let d = {"status":200};
		     return res.json(d);	
			 
		}
   })

})

app.post("/register",(req,res)=>{
   UserVeri.findOne({username:req.body.email},function(err,found){
	   if(!found){
		   if(req.body.password1==req.body.password2){
           const userdetail = new UserVeri({
			   username:req.body.email,
			   password:req.body.password1
		   })
		   userdetail.save();
		   alert("Account created successfully");
		 }else{
			 alert("Password did not match!!");
		 }
	   }else{
		   alert("Account already exists");
	   }
   })
   res.redirect("/frontend/login.html")
})




