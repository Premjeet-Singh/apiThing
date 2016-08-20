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
	var str = {},temp='';
	db.serialize(function(){

// var sql = "SELECT id,title,description,image_path,question,answer_one,answer_two,answer_three,answer_four,score_one,score_two,score_three,score_four,message_one,message_two,message_three,message_four,views,shares,view_total, shares_total from user";
// 	db.all(sql,function(err,rows){
// 		console.log(JSON.stringify(rows));
// 	});

	// console.log(req.body.answer);
	
		db.all("SELECT id,title,description,image_path,question,answer,score,message,views,shares,view_total, shares_total from user", function(err, rows){
			rows.forEach(function (row) {
				var temp_ans=row.answer;
				var temp_score=row.score;
				var temp_msg=row.message;
				var ans_arr = temp_ans.split(",");
				var score_arr = temp_score.split(",");
				var message_arr = temp_msg.split(",");
				console.log(ans_arr[0]);
				console.log(temp_ans);
				
				str[row.id] = [{
				id: row.id,
				title: row.title, 
				desc: row.description, 
				path: row.image_path, 
				ques: row.question, 
				answer: ans_arr,
				score: score_arr,
				messages: message_arr,
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
			db.each("SELECT id,title,description,image_path,question,answer,score,message,views,shares,view_total, shares_total from user WHERE id = ?", req.params.id, function(err, row){
				
			// if(err){
			// 	res.send("Id Not Match Error");
			// 	throw err;
			// }		// console.log('User id: '+row.id, row.title, row.description,row.image_path,row.question,row.answer_one,row.answer_two,row.answer_three,row.answer_four,row.score_one,row.score_two,row.score_three,row.score_four,row.views,row.shares,row.view_total,row.shares_total);
				var temp_ans=row.answer;
				var temp_score=row.score;
				var temp_msg=row.message;
				var ans_arr = temp_ans.split(",");
				var score_arr = temp_score.split(",");
				var message_arr = temp_msg.split(",");
				
				str[row.id] = [{
					 
					title: row.title, 
					desc: row.description, 
					path: row.image_path, 
					ques: row.question, 
					answer: ans_arr,
					score: score_arr,
					messages: message_arr,
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
		db.run("CREATE TABLE IF NOT EXISTS user (id INT, title VARCHAR, description VARCHAR, image_path VARCHAR, question VARCHAR, answer VARCHAR, score INT, message VARCHAR, views INT, shares INT, view_total INT, shares_total INT)");

		var ans_arr1 = [req.body.ans1, req.body.ans2, req.body.ans3, req.body.ans4];
		var ans_arr = ans_arr1.toString();
		var msg = [req.body.message_one,req.body.message_two,req.body.message_three,req.body.message_four];
		var msg_arr = msg.toString();
		var score = [req.body.score1,req.body.score2,req.body.score3,req.body.score4];
		var score_arr = score.toString();
		// console.log(ans_arr);
	// Inserting Form value to The USER Table.................
		var stmt = db.prepare("INSERT into user values(?,?,?,?,?,?,?,?,?,?,?,?)");
			
		

			stmt.run(req.body.id, req.body.title, req.body.desc, req.body.imgpath, req.body.ques, ans_arr, score_arr,msg_arr, req.body.views, req.body.shares, req.body.view_total, req.body.share_total); 
		

		stmt.finalize();
		db.each("SELECT id,title,description,image_path,question,answer,score,message,views,shares,view_total, shares_total from user", function(err, row){
			console.log('User details: '+row.id, row.title, row.description,row.image_path,row.question,row.answer,row.score,row.message,row.views,row.shares,row.view_total,row.shares_total);
			// res.json('User details: '+row.id, row.title, row.description,row.image_path,row.question,row.answer,row.score_one,row.score_two,row.score_three,row.score_four,row.message_one,row.message_two,row.message_three,row.message_four,row.views,row.shares,row.view_total,row.shares_total);
		});
	});

	// Database Connection Closed
	// db.close();

  res.json(req.body);
});


module.exports = router;
