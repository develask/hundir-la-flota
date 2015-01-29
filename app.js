var express = require('express');
var app = express();
var mysql = require("./mysql.js");

var server = app.listen(8080, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

app.use(express.static(__dirname + '/public'));

app.get('/login', function(req, res){
    mysql.signIn(req.query.user, req.query.pass, function(bool){
        if (bool){
            res.send("loged");
        }else{
            res.send("not loged");
        }
    });
});
app.get('/signup', function(req, res){
    if (req.query.hash){
        
    }else{
        mysql.toVerification(req.query.user, req.query.pass, req.query.email, function(bool){
            if (bool){
                res.send("made");
            }else{
                res.send("not made");
            }
        })
    }
});

app.get('/top',function(req, res){
        /*mysql.conseguirPrimerosX(req.query.num , req.query.juego ,function(){
            res.send(
        });*/
    res.send("<p> hola! </p>");
    });

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
//    socket.emit('message', { message: 'welcome to the chat!' });
    socket.on("nuevoUsuario", function(data){
        mysql.newUsuario(data.nombre, data.contraseña, data.email);
    });
    socket.on("signIN", function(data){
        mysql.signIn(data.nombre, data.contraseña, function(bool){
            socket.emit("signed", bool);
        });
    });
    socket.on("disconnect", function () {
        //delete users[socket['izena']];
    });
});