// http://www.thegeekstuff.com/2014/01/mysql-nodejs-intro/

var mysql = require('mysql');
var fs = require('fs');
var user, password;
fs.readFile('.params', function (err, data) {
  if (err) throw err;
  data = data.split('\n');
    console.log(data);
});

var connection =  mysql.createConnection({
  	host : “hostName”,
  	user : “username”,
  	password: “password”
  });

connection.connect();

connection.query(“use database1”);
  var strQuery = “select * from table1”;	
  
  connection.query( strQuery, function(err, rows){
  	if(err)	{
  		throw err;
  	}else{
  		console.log( rows );
  	}
  });

connection.end(function(err){
// Do something after the connection is gracefully terminated.

});


connection.destroy( );