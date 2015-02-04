/*var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
*/


//var express = require('express');
//var app = express();

/*
var server = app.listen(8080, function () {

  
});

var a = https.createServer(options, server);*/

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var mysql = require("./mysql.js");
var app = express();

// your express configuration here

var httpServer = http.createServer(function(req,res){
    res.writeHead(302,{Location: "https://localhost:4433"});
    res.end();
});
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080, function(){
    var host = httpServer.address().address;
    var port = httpServer.address().port;
    console.log('SERVER HTTP listening at http://%s:%s', host, port);});
httpsServer.listen(4433, function(){
     var host = httpsServer.address().address;
    var port = httpsServer.address().port;
    console.log('SERVER HTTPS listening at httpS://%s:%s', host, port);});

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
        try{
            mysql.confirm(req.query.email, req.query.hash,      function(bool){
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
        <a href='https://localhost:4433/'>ENLACE</a>");}
        });
        }catch(e){
            res.send(e.message);
        }
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
app.get('/forgotenPass', function(res, req){
    if ((req.query.user || req.query.email) && !req.query.hash){
    }else if (req.query.email && req.query.hash){
    }else{
    }
});
app.get('/newPass', function(){
//    if (req.query.pass){
//    }else{
//    }
    res.send("Not implemented yet");
})
app.get('/top',function(req, res){
        mysql.conseguirPrimerosX(req.query.num,function(data){
            res.send(JSON.stringify(data));
        });
    });

app.get('/reglas',function(req, res){
      if(req.query.juego==""){
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

app.get('/mostrarUsuarios',function(req, res){
    mysql.getUsuarios(undefined, function(data){
        res.send(JSON.stringify(data));
    });
});
app.get('/amigos',function(req, res){
    mysql.getAmigos(req.query.user,function(data){
        res.send(JSON.stringify(data));
    });
});

app.get('/enviarmensaje',function(req, res){
    mysql.enviarMensaje(req.query.nombre, req.query.username, req.query.mensaje, req.query.asunto,function(err,bool){
                    console.log("envia el mensaje");
    });
});

app.get('/bandejadesalida',function(req, res){
    mysql.getMensajesSalidaJugador(req.query.nombre,function(data){
        res.send(JSON.stringify(data));
    });
});

app.get('/bandejadeentrada',function(req, res){ 
    mysql.getMensajesEntradaJugador(req.query.nombre,function(data){
        res.send(JSON.stringify(data));
    });
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

app.get('/anadir',function(req,res){
    if(req.query.peticion){
       mysql.usuarioExists(req.query.nombre,function(bool){
            if(bool){
                var mensaje="peticion";
                mysql.enviarMensaje(req.query.nombre, req.query.username, mensaje,function(err,bool){
                    console.log("envia el mensaje");
                });
            }else{
                res.send("El Usuario seleccionado no existe");
            }
        });
    }else if(req.query.aceptacion){
        mysql.añadirAmigo(req.query.username,req.query.nombre,function(bool){
        if(bool){
            res.send("El jugador ha sido añadido a tu lista de amigos");
        }else{
            res.send("El jugador seleccionado ya esta dentro de la lista de amigos");
        }
        });
    }
});

var io = require('socket.io').listen(httpsServer);
var hundirlamesa = io.of('/Hundir La Mesa');
var jugadores_hundirlamesa = {};
var rooms = [];
hundirlamesa.on('connection', function(socket){
    socket.on("name", function(name){
        jugadores_hundirlamesa[name] = socket;
        socket.nombre = name;
    });
    socket.on("room", function(datos){
        switch (datos.clase){
            case "new":
                rooms.push(datos.room);
                socket.join(datos.room);
                socket.room = datos.room;
                for (var ind in datos.nombres){
                    try  {
                        jugadores_hundirlamesa[datos.nombres[ind]].emit("room", {nombre: socket.nombre, clase: "peticion", cantidad: datos.nombres.length, room: datos.room});
                    }catch(e){
                        socket.emit("room", {clase: "error", error: datos.nombres[ind]+" no esta jugando."});
                    }
                }
            break;
            case "join":
                if (datos.room){
                    socket.room = datos.room;
                    socket.join(datos.room);
                }else{
                    var num = Math.random() * (rooms.length-1);
                    if (num >= 0){
                        var r = rooms[num];
                        socket.join(r);
                        socket.room = r;
                    }else {
                        socket.emit("room", {clase: "error", error: "No hay abitaciones abiertas"});
                    }
                }
                socket.to(socket.room).emit("room", {clase: "joined", nombre: socket.nombre});
            break;
            case "rechazar":
                jugadores_hundirlamesa[datos.nombre].emit("room", {clase: "rechazar", nombre: socket.nombre});
            break;
            case "cerrar":
                rooms.slice(rooms.indexOf(socket.room), 1);
                socket.to(socket.room).emit("room", {clase: "cerrada"});
            break;
            case "echar":
                try  {
                    jugadores_hundirlamesa[datos.nombre].leave(socket.room);
                    jugadores_hundirlamesa[datos.nombre].emit("room", {nombre: socket.nombre, clase: "echar"});
                    jugadores_hundirlamesa[datos.nombre].room = undefined;
                }catch(e){}
            break;
            default:
                socket.emit("room", {clase: "error", error: "Clase mal definida"});
        }
    });
    socket.on("msg", function(data){
        socket.to(socket.room).emit("msg", data);
    });
    socket.on("disconnect", function () {
        delete jugadores_hundirlamesa[socket.nombre];
    });
});


//var jugadores = {};
//io.sockets.on('connection', function (socket) {
//    socket.on("newloged", function(data){
//        socket.izena = data;
//    });
//    socket.on("cambioJuego", function(data){
//        jugadores[data.jugador] = {juego: data.juego, socket: socket};
//        console.log(data.jugador +" ha cabiado al juego: "+data.juego);
//    });
//    socket.on("msgTo", function(datos){
//        for(var el in datos.quienes){
//            jugadores[datos.quienes[el]].socket.emit("evJuego", datos.msg);
//        }
//    });
//    socket.on("disconnect", function () {
//        //io.sockets.emit("disconnect", socket['izena']);
//        delete jugadores[socket['izena']];
//    });
//    
//});