var server = require("./server");
var router = require("./router");
var socket = require("./socket");
var requestHandlers = require("./requestHandlers");

var listOfAlbums = null;

var handle = {}
handle["/"] = requestHandlers.home;
handle["/snapshot"] = requestHandlers.snapshot;
handle["/snapshot/"] = requestHandlers.snapshot;

var s = server.start(router.route, handle);

var io = require('socket.io').listen(s, {log:false});

socket.init(io);



