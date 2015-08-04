var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require('redis');
var port = process.env.PORT || 3000;

server.listen(port);
console.log('Node app is running on port '+port);

io.on('connection', function (socket) {

    console.log("new client connected");
    var redisClient = redis.createClient();
    redisClient.subscribe('message');

    redisClient.on("monthly_rate", function(channel, message) {
        console.log("mew message in queue "+ message + "channel");
        socket.emit(channel, message);
    });

    socket.on('disconnect', function() {
        redisClient.quit();
    });

});
