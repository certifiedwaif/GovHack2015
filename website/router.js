var path = require("path");
var fs = require("fs");
var requestHandlers = require("./requestHandlers");
var mime = require('mime');
var db = require("./database").db;

var pages = {
	"/": "homepage.html",
	"/random": "demo.html"
};

function route(handle, pathname, response, request) {
	console.log(pathname);
//	console.log(pathname.split("/"));

	//here is the function that is called when you hit "requestjson"
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

	if (typeof handle[pathname] === 'function') {
		handle[pathname](response, request);
	} else if(typeof pages[pathname] != "undefined") {
		routeFile(pages[pathname]);
	} else if (typeof pathname.split("/")[1] != 'undefined' &&
			pathname.split("/")[1].toLowerCase() == "story"){
		routeFile(pages["/"]);
	} else {
		routeFile();
	}

	function routeFile(filename){
		if(typeof filename == "undefined"){
			filename = path.join(process.cwd(), pathname);
		}

		fs.exists(filename, function(exists) {
			if(!exists) {
				console.log("No file found for " + pathname);
				response.writeHead(404, {"Content-Type": "text/plain"});
				response.end("404 Not Found\n");
				return;
			}

			fs.readFile(filename, "binary", function(err,file) {
				if(err) {
					console.log("Error 500, content protected? "+filename);
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.end(err + "\n");
					return;
				}

				fs.stat(filename, function(err, stats){
					if (stats.size > 102400){ //cache files bigger than 100kb?
				//		console.log(stats.size);
				//		console.log(filename +" is a big file! Caching!");
						if (!response.getHeader('Cache-Control') || !response.getHeader('Expires')) {
								response.setHeader("Cache-Control", "public, max-age=345600"); // ex. 4 days in seconds.
								response.setHeader("Expires", new Date(Date.now() + 345600000).toUTCString());  // in ms.
						}
					}
					response.writeHead(200, {'Content-Type': mime.lookup(filename)});
					response.end(file, "binary");
				});
			});
		});
	}
}

function isPhoto(file){
	var result = false;
	var end = file.substring(file.lastIndexOf('.'),file.length).toLowerCase();

	if (end == '.jpg' ||
			end == '.jpeg' ||
			end == '.png' ||
			end == '.gif' ||
			end == '.bmp') {
		result = true;
	}
	
	return result;
}

exports.route = route;