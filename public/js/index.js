var socket;
var web = 'https://localhost:4433/';

function Juego(){
    var juego = "";
    this.juegoSeleccionado = function(nombre){
        try {
            socket.disconnect();
        }catch(e){
        }
        socket = io(web+nombre);
        socket.on("peticionJugar", function(datos){
            if (datos.clase == "peticion"){
                if (confirm(datos.nombre + " quiere jugar contigo.")){
                    socket.emit("peticionJugar", {clase: "respuesta", respuesta: "Si", nombre: datos.nombre});
                    socket.on("msgJuego", function (data){
                        alert(data.quien + ": " +data.datos);
                    });
                }else{
                    socket.emit("peticionJugar", {clase: "respuesta", respuesta: "No", nombre: datos.nombre});
                }
            }else if (datos.clase == "respuesta"){
                if (datos.respuesta == "Si"){
                    socket.on("msgJuego", function (data){
                        alert(data.quien + ": " +data.datos);
                    });
                }
                alert(datos.nombre?datos.nombre+": "+datos.respuesta:datos.respuesta);
            }
        });
        socket.emit("name", user.getName());
        this.restartEvents();
        $.ajax({
            url: "/juego?nombre="+nombre
        }).done(function(data) {
            var data2=JSON.parse(data);
            $("#juego").html(data2.codigohtml);
            eval(data2.codigojavascript);
            juego = nombre;
        });
    }
    this.peticionJugar = function(nombre){
        socket.emit("peticionJugar", {clase: "peticion", nombre: nombre});
    }
    this.getJuego = function(){
        return juego;
    }
    this.emit = function(data){
    //    socket.emit("accion", {juego: juego, data: data});
    }
    var evsJuego = {}; // Aqui van las funciones de los juegos;
   /* socket.on("evJuego", function(dat){
        var echo = false;
        for (var nombreEv in evsJuego){
            if (nombreEv == dat.evento){
                evsJuego[nombreEv](dat.datos);
                echo = true;
                break;
            }
        }
        if (!echo) console.log("Evento recogido sin funcion correspondiente: '"+dat.evento+"'\n\tDatos:\n\t\t"+dat.datos);
    });*/
    this.restartEvents = function (){
        evsJuego = {};
    }
    this.on = function(string, funct){
        evsJuego[string] = funct;
    }
    this.sendMsg = function (msg){
        socket.emit("msgJuego", msg);
    }
   /* socket.on("disconnect", function(nombre){
        console.log("El jugador "+nombre + " se ha salido.");
    });*/
}
var juego = new Juego();

$("#signin").on("click", function(ev){
    $('#signindiv').modal('show');
});

$("#logout").on("click", function(ev){
    $($("#signin").parent()).removeClass("hidden");
    $($("#signup").parent()).removeClass("hidden");
    $($("#userName").parent()).addClass("hidden");
    user.logout();
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
        $("#usuarioregistrado").addClass("dropdown");    
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
                $("#SignUpUser").val("");
                $("#SignUpEmail").val("");
                $("#SignUpContraseña").val("");
                $("#SignUpContraseña2").val("");
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
            $("#exampleInputEmail1").val("");
            $("#exampleInputPassword1").val("");
        }else{
            $("#errSignIn").removeClass("hidden");
        }
    });
});
$("#top10").on("click",function(ev){
    $.ajax({
        url: "/top?num=10"
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

$("#añadiramigos").on("click",function(ev){
    $.ajax({
        url: "/anadiramigos"
    }).done(function( data ) {
        $("#añadiramigosdiv").modal('show');
        $("#listapersonas").html(data);
    });
});

$("#anadiramigosinput").on("change", function(ev){
    $("#listapersonas li").each(function(data){
        console.log(data);
        if($(data).text().indexOf($("#anadiramigosinput").val())>=0){
            
            $(data).removeClass("hidden");
        }else{
            $(data).addClass("hidden");
        }
    });
});  
    
$("#bandejadeentrada").on("click",function(ev){
    $.ajax({
        url: "/bandejadeentrada?nombre="+user.getName()
    }).done(function( data ){
        $("#anadiramigosinput").html(data);
    });
});
    
    
    
    
    
    
    
    
    
    
    
    
    
    
