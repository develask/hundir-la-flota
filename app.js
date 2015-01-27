var express = require('express');
var app = express();

var server = app.listen(8080, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname + '/public'));
var users = {};
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
//    socket.emit('message', { message: 'welcome to the chat!' });
    socket.on('user_name', function (izena) {
        socket['izena'] = izena;
        users[izena] = socket;
    });
    socket.on("kontrakoa_aukeratua", function(name){
        socket['kontrakoa'] = users[name];
        delete users[socket[name]];
        users[name].emit("kont");
    });
    socket.on("disconnect", function () {
        delete users[socket['izena']];
    });
});