var socket;
var web = 'https://localhost:4433';

function Juego(){
    var juego = "";
    var eventos = {};
    var grupoCreado = false;
    var roomEv = {}
    this.juegoSeleccionado = function(nombre){
        try {
            socket.disconnect();
        }catch(e){
        }
        socket = io(web+nombre);
        eventos = {};
        roomEv = {};
        grupoCreado = false;
        $.ajax({
            url: "/juego?nombre="+nombre
        }).done(function(data) {
            var data2=JSON.parse(data);
            $("#juego").html(data2.codigohtml);
            eval(data2.codigojavascript);
            juego = nombre;
        });
        socket.on("room", function(datos){
            switch (datos.clase){
                case "peticion":
                    if (confirm(datos.nombre + " quiere que te unas a " + datos.room + " con " + datos.cantidad+" usuarios.")){
                        socket.emit("room", {clase: "join", room: datos.room});
                        grupoCreado = true;
                    }else{
                        socket.emit("room", {clase: "rechazar", nombre: datos.nombre});
                        grupoCreado=false;
                    }
                break;
                case "joined":
                    if (roomEv["joined"]){
                        roomEv["joined"](datos);
                    }else{
                        alert(datos.nombre + " se ha unido a la partida.");
                    }
                break;
                case "rechazar":
                    if (roomEv["rechazar"]){
                        roomEv["rechazar"](datos);
                    }else{
                        alert(datos.nombre + " ha rechazado la partida.");
                    }
                break;
                case "cerrada":
                    if (roomEv["cerrada"]){
                        roomEv["cerrada"](datos);
                    }else{
                        alert("La partida se ha cerrado.");
                    }
                break;
                case "echar":
                    if (roomEv["cerrada"]){
                        roomEv["cerrada"](datos);
                    }else{
                        alert("Usted ha sido expulsado por "+datos.nombre+".");
                    }
                    grupoCreado = false;
                break;
                case "error":
                    if (roomEv["error"]){
                        roomEv["error"](datos);
                    }else{
                        alert("Error: "+datos.error);
                    }
                break;
                default:
                    console.log(datos);
            }
        });
        socket.on("msg", function(datos){
            var echo = false;
            for (var nombreEv in eventos){
                if (datos.evento == nombreEv){
                    echo = true;
                    eventos[nombreEv](datos.data);
                    break;
                }
            }
            if (!echo) console.log(datos);
        });
        socket.emit("name", user.getName());
    }
    this.crearRoom = function(nombreRoom, quienes){
        socket.emit("room", {clase: "new", room: nombreRoom, nombres: quienes});
        grupoCreado = true;
    }
    this.leaveRoom = function(){
        socket.emit("room", {clase: "echar", nombre: user.getName()});
        grupoCreado = false;
    }
    this.cerrarRoom = function(){
        socket.emit("room", {clase: "cerrar"});
    }
    this.roomEchar = function(nombre){
        socket.emit("room", {clase: "echar", nombre: nombre});
    }
    this.getJuego = function(){
        return juego;
    }
    this.joinToRandomRoom = function(){
        if (!grupoCreado) socket.emit("room", {clase: "join"})
    }
    this.roomEvent = {
        joined: function(funct){roomEv["joined"]=funct;},
        rechazar: function(funct){roomEv["rechazar"]=funct;},
        cerrada: function(funct){roomEv["cerrada"]=funct;},
        echar: function(funct){roomEv["echar"]=funct;},
        error: function(funct){roomEv["error"]=funct;}
    }
    this.emit = function (ev, msg){
        if (grupoCreado){
            socket.emit("msg", {evento: ev, data: msg});
        }else{
            alert("Es necesario estar en un grupo para mandar mensajes a los demás!")
        }
    }
    this.on = function(nombreEv, funct){
        eventos[nombreEv] = funct;
        if (!grupoCreado) console.log("'"+nombreEv+ "' evento creado, pero todavia no se ha entrado a un grupo");
    }
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
    user.getFriends(function( data ) {
        $("#añadiramigosdiv").modal('show');
        $("#listapersonas").html(data);
    });
});

$("#inputamigos").keyup(function(ev){
    $("#listapersonas li").each(function(ind, data){
        if($(data).text().indexOf($("#inputamigos").val())>=0){
            $(data).removeClass("hidden");
        }else{
            $(data).addClass("hidden");
        }
    });
}); 

$("#bandejadesalida").on("click",function(ev){
    user.getUserOutboxMsg(function(data){
        if(data.length>0){
            var html = "<ol>";
            for (var ind in data){
                html += "<li id="+data[ind].id+"> Para:"+data[ind].receptor+"Estado:"+data[ind].leido+"<br><br> Asunto:"+data[ind].cabecera+"</li><button type='button' class='btn btn-default' data-dismiss='modal' id="+boton+data[ind].id+">Ver</button>";
            }
            html += "</ol>"; 
        }else{
            var html = "no hay mensajes";
        }
        $("#bandmensajesdiv").html("");
        $("#bandmensajesdiv").html(html);
        $("#bandejadeentradadiv").modal('show');
    });
});
    
$("#bandejadeentrada").on("click",function(ev){
    user.getUserInboxMsg(function( data ){
        if(data.length>0){
            var html = "<ol>";
            for (var ind in data){
                html += "<li id="+data[ind].id+"> De:"+data[ind].emisor+"Estado:"+data[ind].leido+"<br><br> Asunto:"+data[ind].cabecera+"</li><button type='button' class='btn btn-default' data-dismiss='modal' id="+boton+data[ind].id+">Ver</button>";
            }
            html += "</ol>"; 
        }else{
            var html = "no hay mensajes";
        }
        $("#bandmensajesdiv").html("");
        $("#bandmensajesdiv").html(html);
        $("#bandejadeentradadiv").modal('show');
    });
});

$("#anadir").on("click",function(ev){
    $.ajax({
        url: "/anadir?username="+$("#inputamigos").text()
    }).done(function(data){
        
    });
});
    
    
    

    
    
    
    
    
    
    
    
