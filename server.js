var cors = require('cors');
var app = require('express')();
app.use(cors());

var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require('redis');
var port = process.env.PORT || 3000;

server.listen(port);
console.log('Node app is running on port '+port);

io.on('connection', function (socket) {

    console.log("new client connected");
    var redisClient = redis.createClient(13246, 'pub-redis-13246.us-east-1-3.6.ec2.redislabs.com');
    redisClient.auth('3OX4CdGnAYKStTEZ', function (err) { if (err) throw err; });
    redisClient.subscribe('message');

    redisClient.on("message", function(channel, message) {
        console.log("mew message in queue "+ message + "channel");
        socket.emit(channel, message);
    });

    socket.on('disconnect', function() {
        redisClient.quit();
    });

});
