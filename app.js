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
        mysql.confirm(req.query.email, req.query.hash, function(bool){
            if (bool){
                mysql.newUsuario(req.query.email, function(bool){
                    if (bool){
                        res.send("<h2>GAME - UPV mail verification</h2>\
        <p>Tu usuario ya ha sido creado.</p>\
        <p>Ya puede volver a nuestro servicio y acceder con tus credenciales.</p>\
        <p>Para acceder a nuestro sitio entre en el siguiente enlace:</p>\
        <a href='http://localhost:8080/'>ENLACE</a>");
                    }else{
                        res.send("<h2>GAME - UPV mail verification</h2>\
        <p>Ha ocurrido un error.</p>\
        <p>Es posible que ya estes dado de alta.</p>\
        <p>Para acceder a nuestro sitio entre en el siguiente enlace:</p>\
        <a href='http://localhost:8080/'>ENLACE</a>");
                    }
                });
            }else{res.send("<h2>GAME - UPV mail verification</h2>\
        <p>Lo sentimos, pero no encontramos tus datos.</p>\
        <p>Para aacceder a nuestros servicios tendrá que darse de alta de nuevo.</p>\
        <p>Para acceder a nuestro sitio entre en el siguiente enlace:</p>\
        <a href='http://localhost:8080/'>ENLACE</a>");}
        });
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

app.get('/reglas',function(req, res){
      if(req.query.juego=="Jugar"){
          res.send("<p>No ha elegido un juego, por favor seleccione uno al que jugar</p>");
      }else{
          mysql.getRules(req.query.juego, function(reglas){
            if(reglas){
                res.send(reglas);
            }else{
                res.send("error");
            }
          });
        }
    });

app.get('/juego',function(req, res){
    mysql.getJuego(req.query.nombre, function(data){
        if(data && data[0]){
            res.send(JSON.stringify(data[0]));
        }else{
            res.send("error");
        }
      });
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