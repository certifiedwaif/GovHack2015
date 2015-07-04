var socket = require("./socket");

function minardopage(extra){
return '<!doctype html>'+
'<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">'+
'<head>'+
'<title>Minardo</title>'+
'<script type="text/javascript" src="/socket.io/socket.io.js"></script>'+
'<script type="text/javascript" src="/javascript/d3.v3.5.3.js"></script>'+
'<script type="text/javascript" src="/javascript/jquery-1.11.1.min.js"></script>'+
'<script type="text/javascript" src="/javascript/'+socket.getMinardoVersion()+'"></script>'+
'<script type="text/javascript" src="/javascript/ZeroClipboard.js"></script>'+
'<link rel="stylesheet" href="/javascript/minardo.css"/>'+
'<link rel="shortcut icon" href="/images/minardo.ico" type="image/x-icon"/>'+
'<meta charset="utf-8">'+
'</head>'+
'<body>'+
'<script>'+
'm0.splash.init();'+extra+
'</script>'+
'</body>'+
'</html>'
}

function minardo(response, key){
	console.log("Request handler 'home' was called.");
	var body = minardopage("");
	if (key) {
		body = minardopage('m0.data.init("'+key+'")');
	}
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function snapshot(response){

var body = '<!doctype html>'+
'<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">'+
'<head>'+
'<title>Minardo</title>'+
'<script type="text/javascript" src="/socket.io/socket.io.js"></script>'+
'<script type="text/javascript" src="/javascript/d3.v3.5.3.js"></script>'+
'<script type="text/javascript" src="/javascript/jquery-1.11.1.min.js"></script>'+
'<script type="text/javascript" src="/javascript/'+socket.getMinardoVersion()+'"></script>'+
'<script type="text/javascript" src="/javascript/'+socket.getSnapshotVersion()+'"></script>'+
'<script type="text/javascript" src="/javascript/ZeroClipboard.js"></script>'+
'<link rel="stylesheet" href="/javascript/minardo.css"/>'+
'<link rel="shortcut icon" href="/images/minardo.ico" type="image/x-icon"/>'+
'<meta charset="utf-8">'+
'</head>'+
'<body>'+
'<script>'+
'snap.init()'+
'</script>'+
'</body>'+
'</html>'

response.writeHead(200, {"Content-Type": "text/html"});
response.write(body);
response.end();
}

exports.minardo = minardo;
exports.snapshot = snapshot;






































