var last_time = 0;
var m0_data = {};
var last_checked = {};
var scrapbook = {};
var fs = require("fs");
var wait_time = 900000; //15 minutes in milliseconds
var mysql = require("mysql");

db = {
	init: function(){
		db.dbConnection = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'colesfueloffer',
			database : 'govhack2015'
		});

		db.dbConnection.connect(function(err) {
			if (err) {
				console.error('error connecting: ' + err.stack);
				return;
			}

			console.log('connected as id ' + db.dbConnection.threadId);
		});

		db.dbConnection.on('error', function(err) {
			console.log('db error', err);
			if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
				db.init();                         // lost due to either server restart, or a
			} else {                                      // connnection idle timeout (the wait_timeout
				throw err;                                  // server variable configures this)
			}
		});
		console.log("db connected");

	},
	test: function(d, callback){
		//just a little test to make sure you're connected to the database.
		console.log("running test");
		var query = "select * from localphotostories";

		db.dbConnection.query(query, function(err, results) {
			if(err == null) {
				console.log(results);
//				callback(results);
			}
		});

	},
	get_row: function(id, callback){
		console.log("getting row "+id);
		var query = "select * from localphotostories where row_names = "+id;

		db.dbConnection.query(query, function(err, results) {
			if(err == null) {
				callback(results);
			} else {
				callback();
			}
		});
	}
}



function init(io){
	db.init();

	//this stuff happens once, when the server starts:





	//this stuff happens every time a page is loaded:
	io.on('connection', function(socket){
		//on every connection:
	console.log("socket connected at "+socket.id+" "+socket.handshake.address.address+" "+socket.handshake.headers.referer);
//	console.log();
	//socket.close();
		// pass data from memory. Then update memory from google doc.
		// data is loaded from local when server is started,
		// and saved to local every time it is loaded from google.



		function get_row(d){
			var number = Math.floor(Math.random() * 4000);
			if (typeof d != 'undefined' && d.number != 'undefined'){
				number = d.number;
			}

			db.get_row(number, function(d){
				if(typeof d == 'undefined'){
					get_row();
				} else {
					console.log(d);
					socket.emit("row", d[0]);
				}
			});

		}

		socket.on("get_row", get_row)







	});
}





exports.init = init;
























