var mysql = require("mysql");

var db = {
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

exports.db = db;