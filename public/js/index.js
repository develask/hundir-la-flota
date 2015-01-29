var socket = io('http://localhost:8080');

function Juego(){
    var juego = "";
    this.juegoSeleccionado = function(nombre){
        if (juego != "" && juego != nombre){
            socket.emit("cambioJuego", {juego: nombre, jugador: user.getName()});
        }
        $.ajax({
            url: "/juego?nombre="+nombre
        }).done(function(data) {
            var data2=JSON.parse(data);
            $("#juego").html(data2.codigohtml);
            eval(data2.codigojavascript);
            juego = nombre;
        });
    }
    this.getJuego = function(){
        return juego;
    }
}
var juego = new Juego();

$("#signin").on("click", function(ev){
    $('#signindiv').modal('show');
});

$("#comosejuega").on("click", function(ev){ 
    $.ajax({
            url: "/reglas?juego="+juego.getJuego()
        }).done(function( data ) {
            $("#contenidoIntrucciones").html(data);
            $('#instrucciones').modal('show');
        });
});

$("#signup").on("click", function(ev){
    $('#signupdiv').modal('show');
});

$("#ulJuegos > li").on("click", function(ev){
    if(user.isSigned()){
        juego.juegoSeleccionado($(this).text());
        $("#juego").css("display","block");
        $("#estadisticas").removeClass("hidden");
        $("#estadisticas").addClass("dropdown");
        $("#comosejuega").removeClass("hidden");
    }else{
        $("#signin").trigger('click');
    }
    
    });

$("#signUpC").on("click", function(ev){
    var nombre = $("#SignUpUser").val();
    var email = $("#SignUpEmail").val();
    var con1 = $("#SignUpContraseña").val();
    var con2 = $("#SignUpContraseña2").val();
    if (nombre != "" && email != "" && con1 != "" && con1 == con2){
        user.newUser(nombre, con1, email, function(bool){
            if (bool){
                $('#signupdiv').modal('hide');
                alert("Se ha enviado un correo de verificacion");
            }else{
                alert("Ha ocurrido un error");
            }
        });
    }else{
        alert("Introduce todos los campos correctamente");
    }
});

$("#signInC").on("click", function(ev){
    var nombre = $("#exampleInputEmail1").val();
    var contraseña = $("#exampleInputPassword1").val();
    user.signIn(nombre, contraseña, function(bool){
        if (bool){
            $("#userName").text(nombre);
            $('#signindiv').modal('hide');
            $($("#signin").parent()).addClass("hidden");
            $($("#signup").parent()).addClass("hidden");
            $($("#userName").parent()).removeClass("hidden");
            $("#errSignIn").addClass("hidden");
        }else{
            $("#errSignIn").removeClass("hidden");
        }
    });
});
$("#top10").on("click",function(ev){
    $.ajax({
            url: "/top?num=10&juego="+juego.getJuego()
        }).done(function( data ) {
            $("#topnumber").html("10");
            $("#contenidolistatop").html(data);
            $("#listatop").modal('show');
        });
});
            
$("#top100").on("click",function(ev){
    $.ajax({
            url: "/top?num=100&juego="+juego.getJuego()
        }).done(function( data ) {
            $("#topnumber").html("100");
            $("#contenidolistatop").html(data);
            $("#listatop").modal('show');
        });
});

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
