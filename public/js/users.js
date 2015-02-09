function User(){
    var nombre="";
    
    this.isSigned = function(){
        return nombre !="";
    }
    this.getName = function(){
        return nombre;
    }
    this.signInCookie = function(cook, callback){
        $.ajax({
            url: "/getName"
        }).done(function( data ) {
        //    socket.emit("newloged", name);
            callback(data != "");
            if(data !="") nombre=data;
        });
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
        $.ajax({
            url: "/logout"
        }).done(function( data ) {
            if(data =="ok") nombre="";
        });
    }
    this.newUser = function (name, pass, email, callback){
        $.ajax({
            url: "/signup?user="+name+"&pass="+pass+"&email="+email
        }).done(function( data ) {
                callback(data == "made");
        });
    }
    /*this.getUsers = function(callback){
        $.ajax({
            url: "/mostrarUsuarios"
        }).done(function( data ) {
            callback(JSON.parse(data));
        });
    }*/
    this.getFriends = function(callback){
        $.ajax({
            url: "/amigos"
        }).done(function( data ) {
            callback(JSON.parse(data));
        });
    }
    this.getUserOutboxMsg = function(callback){
        $.ajax({
            url: "/bandejadesalida"
        }).done(function(data){
            callback(JSON.parse(data));
        });
    }
    this.getUserMessage = function(id,callback){
        $.ajax({
            url: "/cogermensajeporid?id="+id
        }).done(function(data){
            callback(JSON.parse(data));
        });
    }
    this.getUserInboxMsg = function(callback){
        $.ajax({
            url: "/bandejadeentrada"
        }).done(function( data ){
            callback(JSON.parse(data));
        });
    }
    this.enviarMensajeAmistad = function(to,callback){
        $.ajax({
            url: "/anadir?peticion=peticion&nombre="+to
        }).done(function(data){
            callback(data);
        });
    }
    this.numMensajesSinLeer = function(callback){
        $.ajax({
            url: "/nummensajessinleer"
        }).done(function(data){
            callback(JSON.parse(data));
        });
    }   
    this.cambiarEstadoHaLeido = function(id,callback){
        $.ajax({
            url: "/cambiarestadomensaje?id="+id
        }).done(function(data){
            callback(data);
        });
    }
    this.enviarMensaje = function(to, subject, message, callback){
        $.ajax({
            url: "/enviarmensaje?to="+to+"&subject="+subject+"&message="+message
        }).done(function(data){
            callback(data);
        });
    }
    this.añadirAmigo = function(to,callback){
        $.ajax({
            url: "/anadir?aceptacion=aceptacion&nombre="+to
        }).done(function(data){
            callback(data);
        });
    }
}

var user = new User();

