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
app.get("gripe.html", function (req, res) {
	console.log(__dirname);
	res.send(__dirname + '/gripe.html');
})
  
// app.get("/gripe.css", function(req, res) {
// 	res.sendFile(_dirname + "/"+"gripe.css");
// });
//re hashing 
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
	var image = req.body.img;
	console.log(title);
	console.log(text);
	console.log(category);
	var time = do_time();
	new_gripe_submission(userid, text, time, title, image, category,0, 0);
	res.end();
});

app.post("/continuous", function(req, res) {
	var userid = req.body.UserID;
	// console.log(userid);
  	User_Query(userid, res, database);
});

app.post("/continuous-twitter", function(req, res) {
	tweets(res);	
});

app.post("/continuous-other", function(req,res){
	var userid = req.body.UserID;
	console.log("running");
	User_Query_Everything(userid, res, database);
	// tweets(userid, res);
});

app.post("/upvote", function(req,res){
		var other_user = req.body.upvoted_user_id;
		var mytxt = req.body.user_text;
		console.log("user id to upvote " + other_user + "\n");
		console.log("user text " + mytxt + "\n");
		updoot(other_user, mytxt, database);
		// User_Query_Everything(null, res);
});
 
app.post("/downvote", function(req,res){
	var other_user = req.body.upvoted_user_id;
	var mytxt = req.body.user_text;
	console.log("user id to downvote " + other_user + "\n");
	console.log("user text " + mytxt + "\n");
	downdoot(other_user, mytxt, database);
	// User_Query_Everything(null, res);
});

app.post("/deletion", function(req,res){
	var other_user = req.body.upvoted_user_id;
	var mytxt = req.body.user_text;
	console.log("user id to downvote " + other_user + "\n");
	console.log("user text " + mytxt + "\n");
	deletion(other_user, mytxt);
	// User_Query_Everything(null, res);
});


const server = app.listen(process.env.PORT || 80, () => {
	const port = server.address().port;
	console.log(`Express is working on port ${port}`);
});

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
const url = "mongodb+srv://newuser1:Password1@cluster0.afvxe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

var database = MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
	if(err){
		console.log(err);
		return;
	}
console.log("success");

});


function do_time(){
	var d = new Date();
	return (d);
}

function get_Day(){
	var d = new Date();
	var day = d.getUTCDate();
	return day;
}

function get_Month(){
	var d = new Date();
	var month = d.getUTCMonth();
	return month;
}
function updoot(user_ID, user_text, database){
	theQuery = {submittedByUID: user_ID, GripeText: user_text}
		if(err){
			console.log(err);
			return;
		}
		var dbo = database.db("gripes");
		var collection = dbo.collection('gripe');
		collection.findOneAndUpdate(theQuery, {$inc: {numVotes: 1}}, function(err,doc){
			if(err){
				console.log(err);
			}
			else{
				console.log("data field upvoted");
			}
		});

}

function downdoot(user_ID, user_text, database){
	theQuery = {submittedByUID: user_ID, GripeText: user_text}
		if(err){
			console.log(err);
			return;
		}
		var dbo = database.db("gripes");
		var collection = dbo.collection('gripe');
		collection.findOneAndUpdate(theQuery, {$inc: {numVotes: -1}}, function(err,doc){
			if(err){
				console.log(err);
			}
			else{
				console.log("data field upvoted");
			}
		});

}

function User_Query(user_ID, res, db){
theQuery = {submittedByUID: user_ID}
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
				res.write("From user <div id=user>"+ items[i].submittedByUID+"</div>");
				res.write("<br>"+items[i].dateSubmitted);
				res.write("<br>"+items[i].GripeTitle);
				res.write("<br>"+items[i].GripeText);
				res.write("<br>"+items[i].GripeImage);
				res.write("<br>"+items[i].GripeCategory);
				res.write("<br><div id=votes>"+items[i].numVotes+"</div>");
				res.write("<div style= font-weight:bold>DELETE POST</div>")
				res.write("<input style=background-color:white; type="+'"'+"button"+'"'+"id="+'"' +items[i].submittedByUID+'"'+"name="+'"'+ items[i].GripeText+'"'+"onclick="+"deletion_button(this.id" + ','+"this.name)"+">");	
				res.write("<br>"+"<br>");	
				res.write("</form>");		
			}			
			res.end();
		}
	});
};

function deletion(user_ID, mytxt){
	var theQuery = {"submittedByUID": user_ID, "GripeText": mytxt};    
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
	 "GripeTitle": gripe_title, "GripeText": submission_text.replace(/\"/g, ""), 
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


function User_Query_Everything(user_ID, res, db){
	theQuery = {submittedByUID: user_ID}
		if(err){
			console.log(err);
			return;
		}
		var dbo = db.db("gripes");
		var collection = dbo.collection('gripe');
		var date = new Date(2021, (get_Month()), (get_Day()+1));
		// db.collection.remove({dateSubmitted: {"$lt" : new Date(2021, (get_Month()), (get_Day()-1))}})
		// console.log("Month is "+ get_Day()+"\n");
		collection.find().sort({numVotes: -1}).toArray(function(err, items){

			// console.log(items);
			if(err){
				console.log(err);
			}
			else{
				for(i = 0; i< items.length; i++){
					res.write("<form id="+'"'+ "like_form"+'"'+ ">");
					res.write("From user <div id=user>"+ items[i].submittedByUID+"</div>");
					res.write("<div style= font-weight:bold>SUBMITTED ON</div>"+items[i].dateSubmitted);
					res.write("<div style= font-weight:bold>THE TITLE</div>"+items[i].GripeTitle);
					res.write("<div style= font-weight:bold>THE GRIPE</div>"+items[i].GripeText);
					res.write("<div style= font-weight:bold>GRIPE IMAGE</div>"+items[i].GripeImage);
					res.write("<div style= font-weight:bold>CATEGORY</div>"+items[i].GripeCategory);
					res.write("<div style= font-weight:bold>VOTES</div><div id=votes>"+items[i].numVotes+"</div>");
					res.write("<div style= font-weight:bold> UP | DOWN</div>");
					res.write("<input type="+'"'+"button"+'"'+"id="+'"' +items[i].submittedByUID+'"'+"name="+'"'+ items[i].GripeText+'"'+"onclick="+"upvote_botton(this.id" + ','+"this.name)"+">");
					res.write("<input style= background-color:black; type="+'"'+"button"+'"'+"id="+'"' +items[i].submittedByUID+'"'+"name="+'"'+ items[i].GripeText+'"'+"onclick="+"downvote_botton(this.id" + ','+"this.name)"+">");
					res.write("<br>"+"<br>");	
					res.write("</form>");	
					var less_than_zero = items[i].dateSubmitted - date;
					var text = items[i].GripeText;
					if(less_than_zero <= 0){
						console.log("deletion taking place\n");
						// db.collection.remove({GripeText: text})
					}	
				}
				res.end();				
			}
		});
	};


function tweets(res){
		var Twitter = require('twitter');
		var client = new Twitter({
		  consumer_key: '0dewEHx5BMgnKRwdMIuYXIqgx',
		  consumer_secret: 'RYllxqJiOjwLbrbYbCJ2eIlOeap3KPyfUtBoUS5dKz3hdFcTe6',
		  access_token_key: '1377475999638556673-duS2Lv2FaAGo2A5BYmgtgqmPGenIiX',
		  access_token_secret: 'rKGgFqo7cymCo9IdYYlxQQd5HfeFwe8tNe4EvjTn6u6Ie'
		});
   try {
	client.get('search/tweets.json', {q: "#complaint"}, function(error, tweets) {
		if (!error) {
			res.write("<h2 style=text-align: center>"+"From real word problems to poor customer service to the internet cutting out, we all have gripes. Check out the world's gripes."+"</h2>");
			  res.write(JSON.stringify(tweets.statuses[0].text));
			  res.write("<br><br>");
			  res.write(JSON.stringify(tweets.statuses[1].text));
			  res.write("<br><br>");
			  res.write(JSON.stringify(tweets.statuses[2].text));
			  res.write("<br><br>");
			  res.write(JSON.stringify(tweets.statuses[3].text));
			  res.write("<br><br>");
			  res.write(JSON.stringify(tweets.statuses[4].text));
			  res.write("<br><br>");
			  res.write(JSON.stringify(tweets.statuses[5].text));
			  res.write("<br><br>");
			  res.write(JSON.stringify(tweets.statuses[6].text));
			  res.write("<br><br>");
			  res.write(JSON.stringify(tweets.statuses[7].text));
			  res.write("<br><br>");
			  res.write(JSON.stringify(tweets.statuses[8].text));
			  res.write("<br><br>");
			  res.write(JSON.stringify(tweets.statuses[9].text));
			  res.write("<br><br>");
			  res.end();  
	  }
	  });
   } catch (error) {
	   console.log("twitter time off\n");
   }
}
