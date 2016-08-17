var express = require('express');
var router = express.Router();
var fs = require("fs");
var bodyParser = require('body-parser');
var url = require("url");
var app     = express();
var data = '';
var pathname = '';
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('fbapp.db');

app.use(bodyParser.urlencoded({ extended: true })); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/insert', function(req, res, next) {
 res.json("hi");
});

// Displayy All fields of dataset.......................
router.get('/displayAll', function(req, res, next) {
	var str = {};
	db.serialize(function(){
	
		db.all("SELECT id,title,description,image_path,question,answer_one,answer_two,answer_three,answer_four,score_one,score_two,score_three,score_four,message_one,message_two,message_three,message_four,views,shares,view_total, shares_total from user", function(err, rows){
			rows.forEach(function (row) {
			str[row.id] = [{
				
				title: row.title, 
				desc: row.description, 
				path: row.image_path, 
				ques: row.question, 
				answer: [row.answer_one, row.answer_two, row.answer_three, row.answer_four],
				score: [row.score_one, row.score_two, row.score_three, row.score_four],
				messages: [row.message_one,row.message_two,row.message_three,row.message_four],
				Views: row.views,
				Shares: row.shares,
				Total_Views: row.view_total,
				Total_Shares: row.shares_total
			}];

			})
			fs.readFile("file.json");
			fs.writeFile('file.json', JSON.stringify( str), "utf8");
			res.json(str);
		});
		
});
	
// res.json("hiiii");
// db.close();
});

// Displayy Particular fields by Specific Id .......................
router.get('/displayOne/:id', function(req, res, next) {
	var str = {};
	db.serialize(function(){
		// try {
			db.each("SELECT id,title,description,image_path,question,answer_one,answer_two,answer_three,answer_four,score_one,score_two,score_three,score_four,message_one,message_two,message_three,message_four,views,shares,view_total, shares_total from user WHERE id = ?", req.params.id, function(err, row){
				
			// if(err){
			// 	res.send("Id Not Match Error");
			// 	throw err;
			// }		// console.log('User id: '+row.id, row.title, row.description,row.image_path,row.question,row.answer_one,row.answer_two,row.answer_three,row.answer_four,row.score_one,row.score_two,row.score_three,row.score_four,row.views,row.shares,row.view_total,row.shares_total);
			
				str[row.id] = [{
					 
					title: row.title, 
					desc: row.description, 
					path: row.image_path, 
					ques: row.question, 
					answer: [row.answer_one, row.answer_two, row.answer_three, row.answer_four],
					score: [row.score_one, row.score_two, row.score_three, row.score_four],
					messages: [row.message_one,row.message_two,row.message_three,row.message_four],
					Views: row.views,
					Shares: row.shares,
					Total_Views: row.view_total,
					Total_Shares: row.shares_total
				}];

				res.json(str);

			});

		// } catch(err){
		// 	console.log(err);
		// }
		
});
	
// Database Connection Closed
// db.close();
});


// Update View Field..............................
router.get('/displayOne/:id/views', function(req, res, next) {
	var v;
	db.serialize(function(){
	
		db.each("SELECT views from user WHERE id = ?", req.params.id, function(err, row){
			
				// console.log('Views: '+row.views);
		v=row.views;
		v++;
		db.run("UPDATE user SET views = ? WHERE id = ?", v, req.params.id);
			

		});
		res.send("Views Updated");
});
	
// Database Connection Closed
// db.close();
});

// Update View Field..............................
router.get('/displayOne/:id/shares', function(req, res, next) {
	var s;
	db.serialize(function(){
	
		db.each("SELECT shares from user WHERE id = ?", req.params.id, function(err, row){
			
				// console.log('Shares: '+row.shares);
			s=row.shares;
			s++;
			db.run("UPDATE user SET shares = ? WHERE id = ?", s, req.params.id);
							

		});
		res.send("Shares Updated");
});
	
// Database Connection Closed
// db.close();
});


// Retrieving nad Insering HTML Form Data ................... 
router.post('/action', function(req, res, next) {
	  

	db.serialize(function(){
		// Creating new USER Table....................
		db.run("CREATE TABLE IF NOT EXISTS user (id INT, title VARCHAR, description VARCHAR, image_path VARCHAR, question VARCHAR, answer_one VARCHAR, answer_two VARCHAR, answer_three VARCHAR, answer_four VARCHAR, score_one INT, score_two INT, score_three INT, score_four INT, message_one VARCHAR, message_two VARCHAR, message_three VARCHAR, message_four VARCHAR, views INT, shares INT, view_total INT, shares_total INT)");

	// Inserting Form value to The USER Table.................
		var stmt = db.prepare("INSERT into user values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
			
			stmt.run(req.body.id, req.body.title, req.body.desc, req.body.imgpath, req.body.ques, req.body.ans1, req.body.ans2, req.body.ans3, req.body.ans4, req.body.score1, req.body.score2, req.body.score3, req.body.score4, req.body.message_one, req.body.message_two, req.body.message_three, req.body.message_four, req.body.views, req.body.shares, req.body.view_total, req.body.share_total); 
		

		stmt.finalize();
		db.each("SELECT id,title,description,image_path,question,answer_one,answer_two,answer_three,answer_four,score_one,score_two,score_three,score_four,message_one,message_two,message_three,message_four,views,shares,view_total, shares_total from user", function(err, row){
			console.log('User details: '+row.id, row.title, row.description,row.image_path,row.question,row.answer_one,row.answer_two,row.answer_three,row.answer_four,row.score_one,row.score_two,row.score_three,row.score_four,row.message_one,row.message_two,row.message_three,row.message_four,row.views,row.shares,row.view_total,row.shares_total);
		});
	});

	// Database Connection Closed
	// db.close();

  res.json(req.body);
});


module.exports = router;
