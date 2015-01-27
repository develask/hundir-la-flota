// http://www.thegeekstuff.com/2014/01/mysql-nodejs-intro/

var mysql = require('mysql');
var fs = require('fs');
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
});

var connection =  mysql.createConnection({
  	host : "localhost",
  	user : user,
  	password: password
});

connection.connect();

//connection.query(“use database1”);
//  var strQuery = “select * from table1”;	
//  
//  connection.query( strQuery, function(err, rows){
//  	if(err)	{
//  		throw err;
//  	}else{
//  		console.log( rows );
//  	}
//  });
//
//connection.end(function(err){
//// Do something after the connection is gracefully terminated.
//
//});
//
//
//connection.destroy( );