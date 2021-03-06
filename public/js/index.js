var socket;
var web = 'https://10.106.30.164:4433/';
var tablerofuera;
function Juego(){
    var juego = "";
    var eventos = {};
    var grupoCreado = false;
    var roomEv = {}
    this.grupoCreadoTrue = function (){grupoCreado = true;}
    this.juegoSeleccionado = function(nombre){
        try {
            socket.disconnect();
        }catch(e){
        }
        socket = io(web+nombre);
        eventos = {};
        roomEv = {};
        grupoCreado = false;
        juego = nombre;
        $.ajax({
            url: "/juego?nombre="+nombre
        }).done(function(data) {
            //var data2=JSON.parse(data);
            //console.log(data2);
            //$("#juego").html(data2.codigohtml);
            $("#juego").html(data);
            //eval(data2.codigojavascript);
		tablerofuera = tablero;
        });
        socket.on("room", function(datos){
            console.log(datos);
            switch (datos.clase){
                case "peticion":
                    if (confirm(datos.nombre + " quiere que te unas a " + datos.room + " con " + datos.cantidad+" usuarios.")){
			console.log("pasa x aki 2");
                        socket.emit("room", {clase: "join", room: datos.room});
                        grupoCreado = true;
                        if (roomEv['aceptado']) roomEv['aceptado']();
                    }else{
                        socket.emit("room", {clase: "rechazar", nombre: datos.nombre});
			console.log("pasa x aki 3");
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
                        alert("La habitacion se ha cerrado.");
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
    }
    this.crearRoom = function(nombreRoom, quienes){
        socket.emit("room", {clase: "new", room: nombreRoom, nombres: quienes});
	console.log("x aki pasa 1");
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
        error: function(funct){roomEv["error"]=funct;},
        aceptado: function(funct){roomEv["aceptado"]=funct;}
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
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
var c = getCookie("gameupv");
if (c){
    user.signInCookie(c, function(bool){
        if (bool){
            var numero;
            user.numMensajesSinLeer(function(data){
                numero=data[0].cuantos;
                $("#userName").html(user.getName()+"&nbsp;&nbsp;&nbsp;<span id='numerodemensajes' class='badge' style='background-color:#FFFF00;' >"+numero+"</span>");
                $($("#signin").parent()).addClass("hidden");
                $($("#signup").parent()).addClass("hidden");
                $($("#userName").parent()).removeClass("hidden");
            });
        }
    });
}
$("#signin").on("click", function(ev){
    $('#signindiv').modal('show');
});
$("#logout").on("click", function(ev){
    $($("#signin").parent()).removeClass("hidden");
    $($("#signup").parent()).removeClass("hidden");
    $($("#userName").parent()).addClass("hidden");
    user.cambiarEstadoaOffline();
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
                alert("Email o nombre repetidos");
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
            var numero;
            user.numMensajesSinLeer(function(data){
                numero=data[0].cuantos;
                $("#userName").html(nombre+"&nbsp;&nbsp;&nbsp;<span id='numerodemensajes' class='badge' style='background-color:yellow;'>"+numero+"</span>");
                $('#signindiv').modal('hide');
                $($("#signin").parent()).addClass("hidden");
                $($("#signup").parent()).addClass("hidden");
                $($("#userName").parent()).removeClass("hidden");
                $("#errSignIn").addClass("hidden");
                $("#exampleInputEmail1").val("");
                $("#exampleInputPassword1").val("");
                user.cambiarEstadoaOnline();
                $("#botonxbandejaentrada").on("click",function(ev){
                    user.numMensajesSinLeer(function(data){
                        $("#numerodemensajes").text("");
                        $("#numerodemensajes").text(data[0].cuantos);
                    });
                });
                $("#botoncerrarbandejaentrada").on("click",function(ev){
                    user.numMensajesSinLeer(function(data){
                        $("#numerodemensajes").text("");
                        $("#numerodemensajes").text(data[0].cuantos);
                    });
                });
            });
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
        var html = "<ol>";
        for (var ind in data){
            html += "<li>"+data[ind].puntuacion+ " - "+data[ind].nombre+"</li>";
        }
        html += "</ol>"; 
        $("#contenidolistatop").html(html);
        $("#listatop").modal('show');
    });
});
            
$("#top100").on("click",function(ev){
    $.ajax({
        url: "/top?num=100&juego="+juego.getJuego()
    }).done(function( data ) {
        $("#topnumber").html("100");
        var html = "<ol>";
        for (var ind in data){
            html += "<li>"+data[ind].puntuacion+ " - "+data[ind].nombre+"</li>";
        }
        html += "</ol>"; 
        $("#contenidolistatop").html(html);
        $("#listatop").modal('show');    
    });
});

$("#añadiramigos").on("click",function(ev){
    user.getFriends(function( data ) {
        $("#añadiramigosdiv").modal('show');
        var htmlAmigos = "<ol>";
        for (var ind in data){
            htmlAmigos += "<li>"+data[ind].nombreamigo+"</li>";
        }
        htmlAmigos += "</ol>";
        $("#listapersonas").html(htmlAmigos);
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
            var html = "";
            for (var ind in data){
                html += "<div class='bs-callout"+(data[ind].leido!="Leido"?" bs-callout-danger":" bs-callout-ok")+"' id='"+data[ind].id+"'><button type='button' class='close borrar' aria-label='Close' name='"+data[ind].id+"'><span aria-hidden='true'>×</span></button><h4>"+data[ind].cabecera+"</h4><p>Para: "+data[ind].receptor+"</p><button type='button' class='btn btn-default' data-dismiss='modal' id='"+data[ind].id+"'>Ver</button></div>";
            }
        }else{
            var html = "no hay mensajes";
        }
        $("#bandejatitle").html("Bandeja de salida:");
        $("#bandmensajesdiv").html("");
        $("#bandmensajesdiv").html(html);
        $("#bandejadeentradadiv").modal('show');
        $("#bandmensajesdiv button.borrar").on("click", function(ev){
            var id = $(this).attr("name");
            var element = $(this);
            user.borrarMail(id, function(b){
                if (b){
                    $(element.parent()).remove();
                }
            });
        });
        $("#bandmensajesdiv button.btn").on("click", function(ev){
            var id = $(this).attr("id");
            user.getUserMessage(id,function(bool){
                if(bool){
                    $("#bandmensajesdiv").html("");
                    var relleno;
                    if(bool[0].cabecera=="peticion"){  
                        relleno = "<div><h4>Asunto: "+bool[0].cabecera+"</h4><h6>De: "+bool[0].emisor+"</h6><h6>Para: "+bool[0].receptor+"</h6><br><p>"+bool[0].mensaje+"</p></div>";
                        $("#bandmensajesdiv").html(relleno);
                        $("#bandejadeentradadiv").modal('show');
                        $("#aceptar").on("click",function(ev){
                            var nombre = $("#paceptar").attr("class");
                            user.añadirAmigo(nombre,function(bool){
                               alert(bool);
                            });
                        });
                    }else{
                        relleno="<div><h4>Asunto: "+bool[0].cabecera+"</h4><h6>De: "+bool[0].emisor+"</h6><h6>Para: "+bool[0].receptor+"</h6><br><p>"+bool[0].mensaje+"</p></div>";                                         
                        $("#bandmensajesdiv").html(relleno);
                        $("#bandejadeentradadiv").modal('show');
                    }
                }else{
                    alert("ha habido un error");
                }
            });
        });
    });
});
    
$("#bandejadeentrada").on("click",function(ev){
    user.getUserInboxMsg(function( data ){
        if(data.length>0){
            var html = "";
            for (var ind in data){
                html += "<div class='bs-callout"+(data[ind].leido!="Leido"?" bs-callout-danger":" bs-callout-ok")+"' id='"+data[ind].id+"'><button type='button' class='close borrar' aria-label='Close' name='"+data[ind].id+"'><span aria-hidden='true'>×</span></button><h4>"+data[ind].cabecera+"</h4><p>De: "+data[ind].emisor+"</p><button type='button' class='btn btn-default' data-dismiss='modal' id='"+data[ind].id+"'>Ver</button></div>";
            }
        }else{
            var html = "no hay mensajes";
        }
        $("#bandejatitle").html("Bandeja de entrada:");
        $("#bandmensajesdiv").html("");
        $("#bandmensajesdiv").html(html);
        $("#bandejadeentradadiv").modal('show');
        $("#bandmensajesdiv button.borrar").on("click", function(ev){
            var id = $(this).attr("name");
            var element = $(this);
            user.borrarMail(id, function(b){
                if (b){
                    $(element.parent()).remove();
                }
            });
        });
        $("#bandmensajesdiv button.btn").on("click", function(ev){
            var id = $(this).attr("id");
            user.cambiarEstadoHaLeido(id,function(bool){
                if(bool){
                    $("#bandmensajesdiv").html("");
                    var relleno;
                    if(bool[0].cabecera=="peticion"){  
                        relleno = "<div><h4>Asunto: "+bool[0].cabecera+"</h4><h6>De: "+bool[0].emisor+"</h6><h6>Para: "+bool[0].receptor+"</h6><br><p>"+bool[0].mensaje+"</p></div>";
                        $("#bandmensajesdiv").html(relleno);
                        $("#bandejadeentradadiv").modal('show');
                        $("#aceptar").on("click",function(ev){
                            var nombre = $("#paceptar").attr("class");
                            user.añadirAmigo(nombre,function(bool){
                               alert(bool);
                            });
                        });
                    }else{
                        relleno="<div><h4>Asunto: "+bool[0].cabecera+"</h4><h6>De: "+bool[0].emisor+"</h6><h6>Para: "+bool[0].receptor+"</h6><br><p>"+bool[0].mensaje+"</p><br><button type='button' class='btn btn-default' data-dismiss='modal' id='responder'>Responder</button></div>";
                        $("#bandmensajesdiv").html(relleno);
                        $("#bandejadeentradadiv").modal('show');
                        $("#responder").on("click",function(ev){
                            var emisor=bool[0].emisor;
                            $("#enviarmensajediv").modal('show');
                            $("#bandejadeentradadiv").modal('hide');
                            $("#paraquien").val(emisor);
                        });
                    }
                }else{
                    alert("ha habido un error");
                }
            });
        });
    });
});

$("#anadir").on("click",function(ev){
    var quien = $("#inputamigos").val();
    user.enviarMensajeAmistad(quien,function(bool){
        if(bool){
            $("#añadiramigosdiv").modal('hide');
            alert("El mensaje ha sido enviado");
        }else{
            alert("No se ha podido enviar el mensaje");
        }
    });
});
    
$("#enviarmensaje").on("click",function(ev){
    $("#enviarmensajediv").modal('show');
});    

$("#botonenviar").on("click",function(ev){
    var para = $("#paraquien").val();
    var asunto = $("#asunto").val();
    var mensaje = $("#mensajeid").val();
    user.enviarMensaje(para,asunto,mensaje,function(bool){
        if(bool){
            $("#paraquien").val("");
            $("#asunto").val("");
            $("#mensajeid").val("");
            $("#enviarmensajediv").modal('hide');
            alert("El mensaje ha sido enviado");
        }else{
            alert("No se ha podido enviar el mensaje");
        }
    });
});
