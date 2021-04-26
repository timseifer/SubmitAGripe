const express = require("express");
const bodyParser    = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
 
app.get("", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
/*
1. use ajax with this api setting specific endpoints
to interact with the api.
-----------------------------------------------
*/
app.post("/new-gripe", function(req, res) {
  	var query = req.body.userID;
	console.log(query);
	new_gripe_submission(query, "na", "na", "na", "na", "na",0, 0);
	res.end();
});

app.post("/continuous", function(req, res) {
  var query = req.body.listenuser;
  console.log(query);
  User_Query(query, res);
});

 
app.listen(8080, function(){
  console.log("server is running on port 3000");
});


var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
const url = "mongodb+srv://newuser1:Password1@cluster0.afvxe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
	if(err){
		console.log(err);
		return;
	}
console.log("success");

});

function User_Query(user_ID, res){
theQuery = {submittedByUID: user_ID}
MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
	if(err){
		console.log(err);
		return;
	}
	var dbo = db.db("gripes");
	var collection = dbo.collection('gripe');
	collection.find(theQuery).toArray(function(err, items){
		console.log(items);
		if(err){
			console.log(err);
		}
		else{
			for(i = 0; i< items.length; i++){
				res.write("<br>"+items[i].dateSubmitted);
				res.end();
				// res.write(items[i].GripeTitle);
				// res.write(items[i].GripeText);
				// res.write(items[i].GripeImage);
				// res.write(items[i].GripeCategory);
				// res.write(items[i].numVotes);
				// res.end();				
			}
		}
	});
	});
};


function deletion(user_ID){
	var theQuery = {UID: user_ID };    
	MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
		if(err){
			console.log(err);
			return;
		}
		var dbo = db.db("gripes");
		var collection = dbo.collection('gripe');
		collection.deleteMany(theQuery, function(err, obj) {    
		if (err) throw err;    
		console.log("document(s) deleted");    
			});
		})
};

function new_gripe_submission(user_ID, submission_text, date_submitted,gripe_title, 
	gripe_image, Gripe_Category, numVotes, numStarVotes){
	var newData = {"submittedByUID": user_ID, "dateSubmitted": date_submitted,
	 "GripeTitle": gripe_title, "GripeText": submission_text, 
	 "GripeImage": gripe_image,
	"GripeCategory": Gripe_Category, "numVotes": numVotes,
	 "numStarVotes": numStarVotes};

		MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
		if(err){
			console.log(err);
			return;
		}
		var dbo = db.db("gripes");
		var collection = dbo.collection('gripe');
		collection.insertOne(newData, function(err, res) {    
			if (err){
				 throw err; 
			}   
			console.log("new document inserted");
		})
		console.log("success");
	});
};

