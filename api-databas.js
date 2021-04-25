
const express = require("express");
const bodyParser = require("body-parser");
 
// New app using express module
const app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
 
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
 

/*
An example post from the front ends input forms
*/
app.post("/your-request", function(req, res) {
  var query = req.body.company;
		MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
			if(err){
				console.log(err);
				return;
			}
			var dbo = db.db("my_database");
			var collection = dbo.collection('companies');
			collection.find({company: query}).toArray(function(err, result) {
				for(i = 0; i< result.length; i++){
					res.write(result[i].company);
				}
			});
			console.log("success");
		});
	res.end();
});

app.post("/ticker", function(req, res) {
	var ticker = req.body.ticker;
	res.send(ticker+"<br>");
});
 
app.listen(3000, function(){
  console.log("server is running on port 3000");
})

const fastcsv = require("fast-csv");
const fs = require("fs");

function populate_csv(csv_file, coll){
	let stream = fs.createReadStream(csv_file);
	let csvData = [];
	let csvStream = fastcsv
	.parse()
	.on("data", function(data) {
		csvData.push({
		company: data[0],
		ticker: data[1],
		});
	})
	.on("end", function() {
		// remove the first line: header
		csvData.shift();
		console.log(csvData)
		coll.insertMany(csvData, function(err, res) {    
			if (err){ throw err; 
			}   
			console.log("new document inserted");
		})
		// save to the MongoDB database collection
	});
	stream.pipe(csvStream);
}

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
const url =
/*newuser1:Password1*/
"mongodb+srv://newuser1:Password1@cluster0.om7kz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db){
	if(err){
		console.log(err);
		return;
	}
	var dbo = db.db("my_database");
	var collection = dbo.collection('companies');

	console.log("success");
	new_data("Apple", "AAPL", collection);
	deletion("Apple", collection);
	User_Query("UID_HERE", collection);
	// delete_many_csv("companies.csv", collection);
	// populate_csv("companies.csv", collection);
});

function User_Query(input, coll){
theQuery = {company: input}
coll.find(theQuery).toArray(function(err, items){
	if(err){
		console.log(err);
	}
	else{
		console.log("Items: ");
		for(i = 0; i< items.length; i++){
			console.log(items[i].company);
			console.log(items[i].ticker);
		}
	}
})
}

function deletion(user_ID, coll){
	var theQuery = {UID: user_ID };    
	coll.deleteMany(theQuery, function(err, obj) {    if (err) throw err;    console.log("document(s) deleted");    });
}

function new_gripe_submission(user_ID, ticker_name, coll){
	var newData = {"company": company_name, "ticker": ticker_name};
	coll.insertOne(newData, function(err, res) {    
	if (err){ throw err; 
	}   
	console.log("new document inserted");
		})
}
