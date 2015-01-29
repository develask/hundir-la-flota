function User(){
    this.signIn = function (name, pass, callback){
        $.ajax({
            url: "/login?user="+name+"&pass="+pass
        }).done(function( data ) {
            callback(data == "loged");
        });
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

