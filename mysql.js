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
    connection.query("SELECT nombre FROM hundirlaflota.users WHERE nombre='"+name+"' UNION SELECT name FROM hundirlaflota.verification WHERE name='"+name+"'", function(err, rows){
        if (rows && rows.length == 0){
            connection.query("INSERT INTO hundirlaflota.verification (`name`,`pass`,`email`) values ('"+name+"','"+has+"','"+email+"')", function(err, rows){
                if(err) throw err;
                mail.sendMail(email, shasum.digest('hex'), function (err, data){
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
    connection.query("SELECT nombre FROM hundirlaflota.users "+user?" WHERE nombre='"+user+"'":"",function(err, rows){
        if(err){
            throw err;
        }else{
            callback(rows);
        }
    });
}

function getMensajesJugador(nombre,callback){
    connection.query("SELECT id, leido, emisor, cabecera FROM hundirlaflota.mensaje WHERE receptor="+nombre+"",function(){
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
module.exports.getMensajesJugador = getMensajesJugador;