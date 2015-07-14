var socket = require("./socket");
var handle = {};
var db = require("./database").db;
var pages = {
	"/": "homepage.html",
	"/random": "demo.html",
	"/story": "story.html"
};


handle["/requestjson"] = function(response, request){
	get_row();
	function get_row() {
		var number = Math.floor(Math.random() * 2900);
		if (typeof d != 'undefined' && d.number != 'undefined'){
			number = d.number;
		}

		db.get_row(number, function(d){
			if(typeof d == 'undefined'){
				get_row();
			} else {
				response.writeHead(200, {"Content-Type": "application/json"});
				response.end(JSON.stringify(d[0]));
			}
		});
	}
	return;
}

handle["/requestjson/382"] = function(response, request){
	get_row();
	function get_row() {
		var number = 382;

		db.get_row(number, function(d){
			if(typeof d == 'undefined'){
				get_row();
			} else {
				response.writeHead(200, {"Content-Type": "application/json"});
				response.end(JSON.stringify(d[0]));
			}
		});
	}
	return;
}

exports.handle = handle;
exports.pages = pages;






































