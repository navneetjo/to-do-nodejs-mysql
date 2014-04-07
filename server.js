// set up ======================================================================
var _mysql = require('mysql');
var mysql = _mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
    });

mysql.query('use test');



var express  = require('express');
var app      = express(); 								// create our app w/ express
//var mongoose = require('mongoose'); 					// mongoose for mongodb

var port = process.env.PORT || 8080;

// configuration ===============================================================

// mongoose.connect('mongodb://node:node@mongo.onmodulus.net:27017/uwO3mypu'); 	// connect to mongoDB database on modulus.io

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
});


// define model ================================================================
/*
var Todo = mongoose.model('Todo', {
	text : String,
	done : Boolean
});
*/

// routes ======================================================================

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/todos', function(req, res) {
      updateFront(req,res)
  });
  


	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
    var strQuery = "insert into animal (scomment) values ( + '" + req.body.text + "') ";	
    mysql.query( strQuery, function(err, todo) {
			if (err)
        console.log("erreur : " + err);
      else
        console.log("insert : " + req.body.text);
		});
    
      updateFront(req,res)
		});


	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
    var strQuery = "delete from animal where id_animal = " + req.params.todo_id ;	
    mysql.query( strQuery, function(err, todo) {
			if (err)
        console.log("erreur delete : " + err);
      else
        console.log("delete : " + req.params.todo_id);
			// get and return all the todos after you create another
		});
    
    updateFront(req,res)


		});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

function updateFront(req,res)
{
  var strQuery = "select id_animal, scomment from animal";	 
  mysql.query( strQuery, function(err, rows){
				if (err)
					res.send(err)
				res.json(rows);
});
}


// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
