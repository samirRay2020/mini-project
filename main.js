//require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const alert = require("alert");
const axios = require('axios');
const fs = require('fs');
const nodemailer = require("nodemailer");
const { stringify } = require("querystring");
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

// let outamountSchema = new mongoose.Schema({
// 	amount:Number
// })
let usercardschema = new mongoose.Schema({
	accountno:String,
	cardno:String,
	firstname:String,
	middlename:String,
	lastname:String,
	panno:String,
	adharno:String,
	mobile:Number,
	email:String,
	instruction:String,
	amount:Number,
	reward:Number,
	activestatus:String
})

const UserVeri = new mongoose.model("UserVeri",userSchema);
const CurrTrack = new mongoose.model("Currtracks",currentSchema);
const Usercard = new mongoose.model("usercards",usercardschema);
//const OutAmount = new mongoose.model("outamounts",outamountSchema);
app.get("/",(req,res)=>{
	res.send(__dirname+"/index.html");
});


app.get("/userdetails",(req,res)=>{
	CurrTrack.find({}, function (err, users) {
		
		return res.json({username:users[0].username});
    });
});


app.post("/createcard",async (req,res)=>{
	 Usercard.findOne({mobile:req.body.mobile},async function(err,found){
           if(found){
			   alert("Mobile number already associated with card");
		   }else{

		 CurrTrack.find({},async function(err,found){
            
			const createnewcard= new Usercard({
				accountno:Math.floor(100000 + Math.random() * 900000),
				cardno:Math.floor(100000 + Math.random() * 900000),
				firstname:req.body.firstname,
				middlename:req.body.middlename,
				lastname:req.body.lastname,
				panno:req.body.panno,
				adharno:req.body.adhaar_number,
				mobile:req.body.phone_number,
				email:found[0].username,
				instruction:req.body.comments,
				amount:474,
				reward:0,
				activestatus:"Active"
			});
			createnewcard.save();
			alert("Card created succesfully");
		 })	
			
		   }

		   res.redirect("./frontend/userpage.html");
	 })
})

app.post("/fillstatementdetails",(req,res)=>{
	 Usercard.find({email:req.body.username},async (ierr,found)=>{
			if(found){
               
				return res.json({
					account:found[0].accountno,
					card:found[0].cardno,
					name:found[0].firstname,
					cstatus:found[0].activestatus
				  }
				)
			}
			
		 })
})

app.post("/updateamount",(req,res)=>{
     Usercard.find({email:req.body.email},async function(err,found){
		 //console.log(found[0].amount);
		  let amttoupdate =  found[0].amount - Number(req.body.amttosub);
		  let amttoadd = found[0].reward + (Number(req.body.amttosub)/10);
		  let doc = await Usercard.findOneAndUpdate({email:found[0].email}, {amount:amttoupdate});
		   let docs = await Usercard.findOneAndUpdate({email:found[0].email}, {reward:amttoadd});
		  return {status:"200"}
	 })
})

app.put("/deregister",(req,res)=>{
	Usercard.findOne({email:req.body.email},async function(err,found){
	  if(found.cardno == req.body.cardno){
		  await Usercard.findOneAndUpdate({email:found.email}, {amount:0});
          await Usercard.findOneAndUpdate({email:found.email}, {activestatus:"Deactive"});
		  alert("Status changed!!");
		  return {status:"200"}
	  }else{
		  alert("Card not invalid");
	  }
	})
})

// app.post("/updatereward", (req,res)=>{
//     Usercard.find({email:req.body.email},async function(err,found){
// 		let amttoupdate =  found[0].reward + (Number(req.body.amounttoadd)/10);
// 		let doc = await Usercard.findOneAndUpdate({email:found[0].email}, {reward:amttoupdate});
// 		return {status:"200"}
// 	 })	
// })
app.post("/getamount",(req,res)=>{
	Usercard.find({email:req.body.email},function(err,found){
		if(found){
			return res.json({amount:found[0].amount});
		}
	})
})
app.post("/getamounttodisplay",(req,res)=>{
	Usercard.find({email:req.body.email},function(err,found){
		 return res.json({
			amount: found[0].amount
		 })
	})
})

app.get("/getcurrentuser", (req,res)=>{
    CurrTrack.find({},function(err,found){
		return res.json({currentuser:found[0].username})
	 })	
})



app.post("/getreward", (req,res)=>{
	//console.log(req.body.cardnumber)
    Usercard.findOne({cardno:req.body.cardnumber},async function(err,found){
		if(found){
		
		return res.json({totalreward:found.reward});
			
		}else{
		    alert("Card no did not match");
	    }
	 })	
})

app.put("/reedem",(req,res)=>{
	Usercard.find({email:req.body.email},async function(err,found){
		let amttoupdate =  found[0].amount + (found[0].reward / 5);
		let doc = await Usercard.findOneAndUpdate({email:found[0].email}, {amount:amttoupdate});
		await Usercard.findOneAndUpdate({email:found[0].email}, {reward:0});
		return {status:"200"}
	 })	
})


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




