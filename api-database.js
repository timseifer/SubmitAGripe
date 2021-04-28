const express = require("express");
const bodyParser    = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

app.get("", function(req, res) {
console.log(__dirname);
  res.sendFile(__dirname + "/index.html");
});

app.get("about.html", function (req, res) {
	console.log(__dirname);
	res.send(__dirname + '/about.html');
})
  
// app.get("/gripe.css", function(req, res) {
// 	res.sendFile(_dirname + "/"+"gripe.css");
// });
app.use(express.static(__dirname));
/*
1. use ajax with this api setting specific endpoints
to interact with the api.
-----------------------------------------------
*/


app.post("/new-gripe", function(req, res) {
	var userid = req.body.userID
  	var title = req.body.title;
	var text = req.body.gripe;
	var category = req.body.category;
	console.log(title);
	console.log(text);
	console.log(category);
	var time = do_time();
	new_gripe_submission(userid, text, time, title, "na", category,0, 0);
	res.end();
});

app.post("/continuous", function(req, res) {
	var userid = req.body.UserID;
	console.log(userid);
  User_Query(userid, res);
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


function do_time(){
	var d = new Date();
	var hours = d.getHours();
	var minutes = d.getMinutes();
	if(minutes > 60){
		hours++;
		minutes = (minutes)-60;
	}
	if(hours > 12){
		hours = hours % 12;
	}
	if(minutes < 10){
		minutes = "0" + minutes;
	}
	
	return (hours.toString() + ":" + minutes.toString());
}

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
				res.write("<form id="+'"'+ "submission"+'"'+ "method="+'"'+"post"+'"'+">");
				res.write("From user " + items[i].submittedByUID);
				res.write("<br>"+items[i].dateSubmitted);
				res.write("<br>"+items[i].GripeTitle);
				res.write("<br>"+items[i].GripeText);
				res.write("<br>"+items[i].GripeImage);
				res.write("<br>"+items[i].GripeCategory);
				res.write("<br>"+items[i].numVotes);	
				res.write("<br>"+"<br>");	
				res.write("</form>");		
			}				
			res.end();
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

