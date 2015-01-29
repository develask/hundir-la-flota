var socket = io('http://localhost:8080');
//socket.on('message', function (data) {
//    console.log(data);
//    socket.emit('send', { my: 'data' });
//});
var nombre;
var nombrejuego;
$("#signin").on("click", function(ev){
    $('#signindiv').modal('show');
});

$("#comosejuega").on("click", function(ev){
    $.ajax({
            url: "/reglas?juego="+nombrejuego
        }).done(function( data ) {
            $("#contenidoIntrucciones").html(data);
            $('#instrucciones').modal('show');
        });
});
$("#signup").on("click", function(ev){
    $('#signupdiv').modal('show');
});
/*
$("#hundir").on("click", function(ev){
    document.getElementById("micanvas").style.display="block";
    var canvas1 = document.getElementById("micanvas1");
    var ctx1 = canvas1.getContext("2d");
    for (var i=40;i<400;i=i+40){
        ctx1.moveTo(i,0);
        ctx1.lineTo(i,400);
    }
    for (var i=40;i<400;i=i+40){
        ctx1.moveTo(0,i);
        ctx1.lineTo(0,i);
    }

    ctx1.strokeStyle = "#f00";                                                                    
    ctx1.stroke(); 
});
*/
/*$(canvas1).on("click", function(ev){
    var x = parseInt((ev.clientX-canvas.offsetLeft)/40);
    var y = parseInt((ev.clientY-canvas.offsetTop)/40);
});*/
$("#hundir").on("click", function(ev){
    document.getElementById("micanvas").style.display="block";
    var canvas1 = document.getElementById("micanvas1");
    var canvas2 = document.getElementById("micanvas2");
    if (canvas1.getContext && canvas1.getContext) {
        var ctx1 = canvas1.getContext("2d");
        var ctx2 = canvas2.getContext("2d");
            for(var x=0;x<10;x++){
                for(var y=0;y<10;y++){
                    if((x+y)%2==0){
                        ctx1.fillStyle = "rgb(200,0,0)";
                        ctx1.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);
                        ctx2.fillStyle = "rgb(200,0,0)";
                        ctx2.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);
                    }else{
                        ctx1.fillStyle = "rgb(255, 255, 255)";
                        ctx1.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);
                        ctx2.fillStyle = "rgb(255, 255, 255)";
                        ctx2.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);
                    }
                }
            }
    }   
    var canvas1 = document.getElementById("micanvas1");
    var ctx1 = canvas1.getContext("2d");
    for (var i=40;i<400;i=i+40){
        ctx1.moveTo(i,0);
        ctx.lineTo(i,400);
    }
    for (var i=40;i<400;i=i+40){
        ctx1.moveTo(0,i);
        ctx.lineTo(0,i);
    }
    ctx1.strokeStyle = "#f00";                                                                    
    ctx1.stroke();
});

$("#micanvas1").on("click", function(ev){
    var canvas1 = document.getElementById("micanvas1");
    var x1 = parseInt((ev.clientX-canvas1.offsetLeft)/40);
    var y1 = parseInt((ev.clientY-canvas1.offsetTop)/40);
    alert(x1 + "  " + y1);
    
});

$("#micanvas2").on("click", function(ev){
    var canvas2 = document.getElementById("micanvas2");
    var x2 = parseInt((ev.clientX-canvas2.offsetLeft)/40);
    var y2 = parseInt((ev.clientY-canvas2.offsetTop)/40);
    alert(x2 + "  " + y2);
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
    nombre = $("#exampleInputEmail1").val();
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
            url: "/top?num=10&juego="+nombrejuego
        }).done(function( data ) {
            $("#topnumber").html("10");
            $("#contenidolistatop").html(data);
            $("#listatop").modal('show');
        });
});
            
$("#top100").on("click",function(ev){
    $.ajax({
            url: "/top?num=100&juego="+nombrejuego
        }).done(function( data ) {
            $("#topnumber").html("100");
            $("#contenidolistatop").html(data);
            $("#listatop").modal('show');
        });
});