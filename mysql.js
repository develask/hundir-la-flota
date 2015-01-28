// http://www.thegeekstuff.com/2014/01/mysql-nodejs-intro/

var mysql = require('mysql');
var crypto = require('crypto');
    
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