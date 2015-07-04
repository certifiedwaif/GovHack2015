var last_time = 0;
var m0_data = {};
var last_checked = {};
var scrapbook = {};
var fs = require("fs");
var wait_time = 900000; //15 minutes in milliseconds
var db = require("./database").db;

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
























