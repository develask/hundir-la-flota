// http://www.thegeekstuff.com/2014/01/mysql-nodejs-intro/

var mysql = require('mysql');
var crypto = require('crypto');
var mail = require('./mail.js');
    
var connection =  mysql.createConnection({
    host : "176.84.104.76",
    user : "hundir",
    password: "laflota"
});

connection.connect();

connection.query("use hundirlaflota");

function newUsuario(email, callback){
    connection.query("SELECT * FROM hundirlaflota.verification WHERE email='"+email+"'", function(err, rows){
        connection.query("DELETE FROM hundirlaflota.verification WHERE email='"+email+"'");
        try {
            connection.query("INSERT INTO hundirlaflota.users (`nombre`,`contraseña_hash`,`email`) values ('"+rows[0].name+"','"+rows[0].pass+"','"+rows[0].email+"')", function(err, rows){
                if(err) throw err;
                callback(true);
            });
        }catch(e){
            callback(false);
        }
    });
}

function confirm(email, hash, callback){
    connection.query("SELECT * FROM hundirlaflota.verification WHERE email='"+email+"'", function(err, rows){
        if(err) throw err;
        var row;
        var tt = false;
        for (var i in rows){
            row = rows[i];
             var shasum = crypto.createHash('sha1');
            shasum.update(row.name + row.pass + row.email);
            var has = shasum.digest('hex');
            if (has == hash){
                tt = true;
                break;
            }
        }
        callback(tt);
    });
}

function toVerification(name, pass, email, callback){
    var shasum = crypto.createHash('sha1');
    var shasum2 = crypto.createHash('sha1');
    shasum2.update(pass+name);
    var has = shasum2.digest('hex');
    shasum.update(name+has+email);
    connection.query("SELECT nombre FROM hundirlaflota.users WHERE nombre='"+name+"' OR email='"+email+"' UNION SELECT name FROM hundirlaflota.verification WHERE name='"+name+"' OR email='"+email+"'", function(err, rows){
        if (rows && rows.length == 0){
            connection.query("INSERT INTO hundirlaflota.verification (`name`,`pass`,`email`) values ('"+name+"','"+has+"','"+email+"')", function(err, rows){
                if(err) throw err;
                mail.verificationMail(email, shasum.digest('hex'), function (err, data){
                    if (!err){
                        callback(true);
                    }else{
                        callback(false);
                    }
                });
            });
        }else{
            callback(false);
        }
    });
}

function signIn(user, password, callback){
    var shasum = crypto.createHash('sha1');
    shasum.update(password+user);
    connection.query("SELECT * FROM hundirlaflota.users WHERE nombre='"+user+"' AND contraseña_hash='"+shasum.digest('hex')+"'", function(err, rows){
        if(err) throw err;
        if (rows.length == 1){
            callback(true);
        }else{
            callback(false);
        }
    });
}
function conseguirPrimerosX(numero, callback){
    connection.query("SELECT nombre, puntuacion FROM hundirlaflota.users ORDER BY puntuacion DESC LIMIT "+numero,function(err,rows){
        if(err){ 
            throw err;
        }else{
            callback(rows);
        }
    });   
}

function getUsuarios(user, callback){
    connection.query("SELECT nombre FROM hundirlaflota.users "+(user?" WHERE nombre='"+user+"'":""),function(err, rows){
        if(err){
            throw err;
        }else{
            callback(rows);
        }
    });
}

function getAmigos(user, callback){
    connection.query("SELECT nombreamigo FROM hundirlaflota.amigos WHERE nombre='"+user+"'",function(err, rows){
        if(err){
            throw err;
        }else{
            callback(rows);
        }
    });
}

function getMensajesSalidaJugador(nombre,callback){
    connection.query("SELECT id, leido, receptor, cabecera FROM hundirlaflota.mensajes WHERE emisor='"+nombre+"'",function(err, rows){
        if(err){
            throw err;
        }else{
            callback(rows);
        }
    });
}

function añadirAmigo(user, nombre,callback){
    try{
        connection.query("INSERT INTO hundirlaflota.amigos (nombre, nombreamigo) VAlUES ('"+user+"', '"+nombre+"') ",function(err, data){
            if(err){
                throw err;
            }else{
                callback(true);
            }
         });
        connection.query("INSERT INTO hundirlaflota.amigos (nombre, nombreamigo) VAlUES ('"+nombre+"', '"+user+"') ",function(err, data){
            if(err){
                throw err;
            }else{
                callback(true);
            }
         });
    }catch(e){
        callback(false);
    }
   
}

function enviarMensaje(from, to, message, subject, callback){
    if(message=="peticion"){
        try{
            connection.query("SELECT * FROM hundirlaflota.amigos WHERE nombre='"+from+"' AND nombreamigo='"+to+"'",function(err, rows){
                if(err){    
                    throw err;
                }else if(rows.length==0){
                    message="El emisor del mensaje quiere ser tu amigo";
                    connection.query("INSERT INTO hundirlaflota.mensajes (emisor, receptor, mensaje, noiz, leido, cabecera) VALUES ('"+from+"', '"+to+"', '"+message+"', NOW(), '0', '"+subject+"')",function(err, rows){
                        if(err){
                            throw err;
                        }else{
                            callback(true);
                        } 
                    });
                }else{
                    callback(false);
                }
            });
        }catch(e){
            callback(false);
        }
    }else{
        try{
            connection.query("INSERT INTO hundirlaflota.mensajes (emisor, receptor, mensaje, noiz, leido, cabecera) VALUES ('"+from+"', '"+to+"', '"+message+"', NOW(), '0', '"+subject+"')",function(err, rows){
                if(err){
                    console.log("err");
                    throw err;
                }else{
                    console.log("true");
                    callback(true);
                }
            });
        }catch(e){
            callback(false);
        }
    }
}

function usuarioExists(nombre,callback){
    try{
        connection.query("SELECT nombre FROM hundirlaflota.users WHERE nombre='"+nombre+"'",function(err, rows){
            if(err || rows.length == 0){
                throw err;
            }else{
                callback(true)
            }
        });
    }catch(e){
        callback(false);
    }
}

function getMensajesEntradaJugador(nombre,callback){
    connection.query("SELECT id, leido, emisor, cabecera FROM hundirlaflota.mensajes WHERE receptor='"+nombre+"'",function(err, rows){
        if(err){
            throw err;
        }else{
            callback(rows);
        }
    });
}

function getMensajeid(id, callback){
    connection.query("SELECT emisor, cabecera, mensaje FROM hundirlaflota.mensajes WHERE id='"+id+"'", function(err,rows){
        if(err){
            throw err;
        }else{
            callback(rows);
        }
    });
}
function getJuego(nombre, callback){
    connection.query("SELECT codigohtml, codigojavascript FROM hundirlaflota.juego WHERE nombre ='"+nombre+"' ",function(err,rows){
        if(err){ 
            throw err;
        }else{
            callback(rows);
        }
    });   
}

function getRules(juego,callback){
    connection.query("SELECT reglas FROM hundirlaflota.juego WHERE nombre ='"+juego+"' ",function(err,rows){
        if(err){ 
            throw err;
        }else{
            callback(rows[0].reglas);
        }
    });   
}

function getJuegosNames(callback){
    connection.query("SELECT nombre FROM juego", function (err, data){
        if(err){ 
            throw err;
        }else{
            callback(data);
        }
    });
}

module.exports.getJuego = getJuego;
module.exports.getRules = getRules;
module.exports.newUsuario = newUsuario;
module.exports.signIn = signIn;
module.exports.toVerification = toVerification;
module.exports.confirm = confirm;
module.exports.conseguirPrimerosX = conseguirPrimerosX;
module.exports.getUsuarios = getUsuarios;
module.exports.getJuegosNames = getJuegosNames;
module.exports.getMensajesEntradaJugador = getMensajesEntradaJugador;
module.exports.getMensajesSalidaJugador = getMensajesSalidaJugador;
module.exports.getAmigos = getAmigos;
module.exports.añadirAmigo = añadirAmigo;
module.exports.usuarioExists = usuarioExists;
module.exports.enviarMensaje = enviarMensaje;
module.exports.getMensajeid = getMensajeid;