// http://www.thegeekstuff.com/2014/01/mysql-nodejs-intro/

var mysql = require('mysql');
var fs = require('fs');
var crypto = require('crypto');

var user;
var password;
fs.readFile('./.params.txt', {encoding: 'utf8'}, function (err, data) {
  if (err) throw err;
    data = data.split('\n');
    for(var each in data){
        var l = data[each].split(":");
        if (l[0] == "user") user =  l[1];
        if (l[0] == "password") password =  l[1];
    }
    console.log(user, password);
    
    var connection =  mysql.createConnection({
        host : "127.0.0.1",
        user : user,
        password: password
    });

    connection.connect();

    connection.query("use hundirlaflota");
    //  var strQuery = “select * from table1”;	
    //  
    //  connection.query( strQuery, function(err, rows){
    //  	if(err)	{
    //  		throw err;
    //  	}else{
    //  		console.log( rows );
    //  	}
    //  });
    function newUsuario(nombre, contraseña, email){
        var shasum = crypto.createHash('sha1');
        shasum.update(contraseña+nombre);
        connection.query("INSERT INTO users (`nombre`,`contraseña_hash`,`email`) values ('"+nombre+"','"+shasum.digest('hex')+"','"+email+"')", function(err, rows){
            if(err) throw err;
            console.log(rows);
        });
    }
    
    module.exports.newUsuario = newUsuario;
});