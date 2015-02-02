function User(){
    var nombre="";
    
    this.isSigned = function(){
        return nombre !="";
    }
    this.getName = function(){
        return nombre;
    }
    this.signIn = function (name, pass, callback){
        $.ajax({
            url: "/login?user="+name+"&pass="+pass
        }).done(function( data ) {
        //    socket.emit("newloged", name);
            callback(data == "loged");
            if(data =="loged") nombre=name;
        });
    }
    this.logout = function (){
        nombre="";
    }
    this.newUser = function (name, pass, email, callback){
        $.ajax({
            url: "/signup?user="+name+"&pass="+pass+"&email="+email
        }).done(function( data ) {
                callback(data == "made");
        });
    }
    this.getUsers = function(callback){
        $.ajax({
            url: "/mostrarUsuarios"
        }).done(function( data ) {
            callback(JSON.parse(data));
        });
    }
    this.getFriends = function(callback){
        $.ajax({
            url: "/amigos?user="+this.getName()
        }).done(function( data ) {
            callback(JSON.parse(data));
        });
    }
    this.getUserOutboxMsg = function(callback){
        $.ajax({
            url: "/bandejadesalida?nombre="+this.getName()
        }).done(function(data){
            callback(JSON.parse(data));
        });
    }
    this.getUserInboxMsg = function(callback){
        $.ajax({
            url: "/bandejadeentrada?nombre="+this.getName()
        }).done(function( data ){
            callback(JSON.parse(data));
        });
    }
}

var user = new User();

