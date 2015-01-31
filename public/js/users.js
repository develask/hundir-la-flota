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
            socket.emit("newloged", name);
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
    
}

var user = new User();

