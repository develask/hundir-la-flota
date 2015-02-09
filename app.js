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
var crypto = require('crypto');
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
var usersLoged = {};
function comprobarCookie(cookie){
    var value = "; " + cookie;
    var parts = value.split("; gameupv=");
    if (parts.length == 2) return usersLoged[parts.pop().split(";").shift()];
}
app.get('/getName', function(req, res){
    var name = comprobarCookie(req.headers.cookie);
    res.send(name?name:"");
});
app.get('/login', function(req, res){
    mysql.signIn(req.query.user, req.query.pass, function(bool){
        if (bool){
            var shasum = crypto.createHash('sha1');
            shasum.update(req.query.user+req.query.pass+Date.now());
            var cook = shasum.digest('hex');
            usersLoged[cook] = req.query.user;
            res.cookie("gameupv", cook, { expires: new Date(Date.now() + 3600000), httpOnly: false });
            res.send("loged");
        }else{  
            res.send("not loged");
        }
    });
});
app.get('/logout', function(req, res){
    delete usersLoged[comprobarCookie(req.headers.cookie)];
    res.cookie("gameupv", "", { expires: new Date(Date.now()-1000), httpOnly: false });
    res.send("ok")
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
app.get('/forgotenPass', function(req, res){
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

app.get('/cogermensajeporid', function(req, res){
    var us = comprobarCookie(req.headers.cookie);
    mysql.getMensajeid(req.query.id, us, function(data){
        var shasum = crypto.createHash('sha1');
        shasum.update(us+Date.now());
        var cook = shasum.digest('hex');
        var value = "; " + req.headers.cookie; var parts = value.split("; gameupv=");     if (parts.length == 2) delete usersLoged[parts.pop().split(";").shift()];
        usersLoged[cook] = us;
        res.cookie("gameupv", cook, { expires: new Date(Date.now() + 3600000), httpOnly: false });
         res.send(JSON.stringify(data)  );
    });
});

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

/*app.get('/mostrarUsuarios',function(req, res){
    mysql.getUsuarios(undefined, function(data){
        res.send(JSON.stringify(data));
    });
});*/
app.get('/amigos',function(req, res){
    var us = comprobarCookie(req.headers.cookie);
    mysql.getAmigos(us,function(data){
        var shasum = crypto.createHash('sha1');
        shasum.update(us+Date.now());
        var cook = shasum.digest('hex');
        var value = "; " + req.headers.cookie; var parts = value.split("; gameupv=");     if (parts.length == 2) delete usersLoged[parts.pop().split(";").shift()];
        usersLoged[cook] = us;
        res.cookie("gameupv", cook, { expires: new Date(Date.now() + 3600000), httpOnly: false });
        res.send(JSON.stringify(data));
    });
});

app.get('/cambiarestadomensaje',function(req,res){
    var us = comprobarCookie(req.headers.cookie);
    mysql.cambiarEstadoMensaje(req.query.id, us,function(bool){
        var shasum = crypto.createHash('sha1');
        shasum.update(us+Date.now());
        var cook = shasum.digest('hex');
        var value = "; " + req.headers.cookie; var parts = value.split("; gameupv=");     if (parts.length == 2) delete usersLoged[parts.pop().split(";").shift()];
        usersLoged[cook] = us;
        res.cookie("gameupv", cook, { expires: new Date(Date.now() + 3600000), httpOnly: false });
        res.send(bool);
    });
});

app.get('/enviarmensaje',function(req, res){
    var us = comprobarCookie(req.headers.cookie);
    var shasum = crypto.createHash('sha1');
        shasum.update(us+Date.now());
        var cook = shasum.digest('hex');
        var value = "; " + req.headers.cookie; var parts = value.split("; gameupv=");     if (parts.length == 2) delete usersLoged[parts.pop().split(";").shift()];
        usersLoged[cook] = us;
        res.cookie("gameupv", cook, { expires: new Date(Date.now() + 3600000), httpOnly: false });
    mysql.usuarioExists(req.query.to,function(bool){
        if(bool){
            mysql.enviarMensaje(us, req.query.to, req.query.message, req.query.subject,function(bool){
                res.send(bool); 
            });
        }else{
            res.send(bool);
        }
    });
    
});

app.get('/nummensajessinleer',function(req, res){
    var us = comprobarCookie(req.headers.cookie);
    var shasum = crypto.createHash('sha1');
        shasum.update(us+Date.now());
        var cook = shasum.digest('hex');
        var value = "; " + req.headers.cookie; var parts = value.split("; gameupv=");     if (parts.length == 2) delete usersLoged[parts.pop().split(";").shift()];
        usersLoged[cook] = us;
        res.cookie("gameupv", cook, { expires: new Date(Date.now() + 3600000), httpOnly: false });
    mysql.numMensajesSinLeer(us, function(data){
        res.send(JSON.stringify(data));
    });
});
app.get('/borrarMail', function(req, res){
    var us = comprobarCookie(req.headers.cookie);
    var shasum = crypto.createHash('sha1');
        shasum.update(us+Date.now());
        var cook = shasum.digest('hex');
        var value = "; " + req.headers.cookie; var parts = value.split("; gameupv=");     if (parts.length == 2) delete usersLoged[parts.pop().split(";").shift()];
        usersLoged[cook] = us;
        res.cookie("gameupv", cook, { expires: new Date(Date.now() + 3600000), httpOnly: false });
    mysql.borrarMail(req.query.id, us, function(bool){
        res.send(bool?"Ok":"Fail");
    });
});
app.get('/bandejadesalida',function(req, res){
    var us = comprobarCookie(req.headers.cookie);
    var shasum = crypto.createHash('sha1');
        shasum.update(us+Date.now());
        var cook = shasum.digest('hex');
        var value = "; " + req.headers.cookie; var parts = value.split("; gameupv=");     if (parts.length == 2) delete usersLoged[parts.pop().split(";").shift()];
        usersLoged[cook] = us;
        res.cookie("gameupv", cook, { expires: new Date(Date.now() + 3600000), httpOnly: false });
    mysql.getMensajesSalidaJugador(us,function(data){
        res.send(JSON.stringify(data));
    });
});

app.get('/bandejadeentrada',function(req, res){ 
    var us = comprobarCookie(req.headers.cookie);
    var shasum = crypto.createHash('sha1');
        shasum.update(us+Date.now());
        var cook = shasum.digest('hex');
        var value = "; " + req.headers.cookie; var parts = value.split("; gameupv=");     if (parts.length == 2) delete usersLoged[parts.pop().split(";").shift()];
        usersLoged[cook] = us;
        res.cookie("gameupv", cook, { expires: new Date(Date.now() + 3600000), httpOnly: false });
    mysql.getMensajesEntradaJugador(us,function(data){
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
    var nombre = comprobarCookie(req.headers.cookie);
    var us =nombre;
    var shasum = crypto.createHash('sha1');
        shasum.update(us+Date.now());
        var cook = shasum.digest('hex');
        var value = "; " + req.headers.cookie; var parts = value.split("; gameupv=");     if (parts.length == 2) delete usersLoged[parts.pop().split(";").shift()];
        usersLoged[cook] = us;
        res.cookie("gameupv", cook, { expires: new Date(Date.now() + 3600000), httpOnly: false });
    if(req.query.peticion){
       mysql.usuarioExists(req.query.nombre,function(bool){
            if(bool){
                mysql.mirarSiEsAmistad(req.query.nombre,nombre,function(err,data){
                    if(err){
                        throw err;
                    }else if(data.length==0){
                        var mensaje="peticion";
                        mysql.enviarMensaje(nombre,req.query.nombre, mensaje,"peticion",function(bool){
                                res.send(bool);
                        });
                    }else{
                        res.send(false);
                    } 
                });
            }else{
                res.send(false);
            }
        });
    }else if(req.query.aceptacion){
        mysql.añadirAmigo(nombre,req.query.nombre,function(bool){
            if(bool){
                res.send("El jugador ha sido añadido a tu lista de amigos");
            }else{
                res.send("El jugador seleccionado ya estaba dentro de la lista de amigos");
            }
        });
    }else{
        res.send("vaya mierda");
    }
});

var io = require('socket.io').listen(httpsServer);
var hundirlamesa = io.of('/Hundir La Mesa');
var jugadores_hundirlamesa = {};
var rooms = [];
hundirlamesa.on('connection', function(socket){
    var name = comprobarCookie(socket.request.headers.cookie);
    console.log("Nombre: "+name);
    jugadores_hundirlamesa[name] = socket;
    socket.nombre = name;
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

//setInterval(function(){
//    console.log(usersLoged);
//}, 5000);