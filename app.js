var express = require('express');
var app = express();

var server = app.listen(8080, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
//        io.sockets.emit('message', data);
        console.log(data);
    });
    socket.on("disconnect", function () {
//        io.sockets.emit("user disconnected");
        console.log("user disconnect");
    });
});