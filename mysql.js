// http://www.thegeekstuff.com/2014/01/mysql-nodejs-intro/

var mysql = require('mysql');
var crypto = require('crypto');
var mail = require('./mail.js');
    
var connection =  mysql.createConnection({
    host : "176.84.103.209",
    user : "hundir",
    password: "laflota"
});

connection.connect();

connection.query("use hundirlaflota");

function newUsuario(nombre, contraseña, email){
    var shasum = crypto.createHash('sha1');
    shasum.update(contraseña+nombre);
    connection.query("INSERT INTO hundirlaflota.users (`nombre`,`contraseña_hash`,`email`) values ('"+nombre+"','"+shasum.digest('hex')+"','"+email+"')", function(err, rows){
        if(err) throw err;
    });
}

function toVerification(name, pass, email, callback){
    var shasum = crypto.createHash('sha1');
    shasum.update(name+pass+email);
    var shasum2 = crypto.createHash('sha1');
    shasum2.update(pass+name);
    connection.query("SELECT nombre FROM hundirlaflota.users WHERE nombre='"+name+"' UNION SELECT name FROM hundirlaflota.verification WHERE name='"+name+"'", function(err, rows){
        if (rows && rows.length == 0){
            connection.query("INSERT INTO hundirlaflota.verification (`name`,`pass`,`email`) values ('"+name+"','"+shasum2.digest('hex')+"','"+email+"')", function(err, rows){
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

module.exports.newUsuario = newUsuario;
module.exports.signIn = signIn;
module.exports.toVerification = toVerification;