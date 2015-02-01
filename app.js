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
        <a href='http://localhost:4433/'>ENLACE</a>");}
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
        mysql.conseguirPrimerosX(req.query.num,function(data){
        if(data.length>0)
            var html = "<ol>";
            for (var ind in data){
                html += "<li>"+data[ind].puntuacion+ " - "+data[ind].nombre+"</li>";
            }
            html += "</ol>"; 
            res.send(html);
        });
    //res.send("<p> hola! </p>");
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

app.get('/anadiramigos',function(req, res){
    mysql.getUsuarios(function(data){
        console.log(data);
        if(data.length>0){
            var html = "<ol>";
            for (var ind in data){
                html += "<li> "+data[ind].nombre+" </li>";
            }
            html += "</ol>"; 
            res.send(html);
        }else{
            res.send("error");
        }
    });
});

app.get('/bandejadeentrada',function(req, res){
    mysql
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

var io = require('socket.io').listen(httpsServer);
var hundirlamesa = io.of('/Hundir La Mesa');
var jugadores_hundirlamesa = {};
hundirlamesa.on('connection', function(socket){
    socket.on("name", function(name){
        jugadores_hundirlamesa[name] = socket;
        socket.nombre = name;
    });
    socket.on("peticionJugar", function(datos){
        if (datos.clase == "peticion"){
            try {
                jugadores_hundirlamesa[datos.nombre].emit("peticionJugar", {clase: "peticion", nombre: socket.nombre});
            }catch(e){
                socket.emit("peticionJugar", {clase: "respuesta", respuesta: "No esta en este Juego"});
            }
        }else if (datos.clase == "respuesta"){
            try {
                jugadores_hundirlamesa[datos.nombre].emit("peticionJugar", {clase: "respuesta", nombre: socket.nombre, respuesta: datos.respuesta});
                if (datos.respuesta == "Si"){
                    socket.join(socket.nombre);
                    jugadores_hundirlamesa[datos.nombre].join(socket.nombre);
                     var s2 = jugadores_hundirlamesa[datos.nombre];
                    socket.on("msgJuego", function(data){
                        socket.broadcast.emit("msgJuego", {quien: socket.nombre, datos: data});
                    });
                    s2.on("msgJuego", function(data){
                        s2.broadcast.emit("msgJuego", {quien: s2.nombre, datos: data});
                    });
                }
            }catch(e){
                socket.emit("peticionJugar", {clase: "respuesta", respuesta: "Ese usuario se ha salido del juego"});
            }
        }
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