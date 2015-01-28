var socket = io('http://localhost:8080');
//socket.on('message', function (data) {
//    console.log(data);
//    socket.emit('send', { my: 'data' });
//});
var nombre;
$("#signin").on("click", function(ev){
    $('#signindiv').modal('show');
});
$("#comosejuega").on("click", function(ev){
    $('#instrucciones').modal('show');
});
$("#signup").on("click", function(ev){
    $('#signupdiv').modal('show');
});
$("#signup").on("click", function(ev){
    $('#signupdiv').modal('show');
});

<<<<<<< HEAD
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

$(canvas1).on("click", function(ev){
    var x = parseInt((ev.clientX-canvas.offsetLeft)/40);
    var y = parseInt((ev.clientY-canvas.offsetTop)/40);
/*=======
$("#jugar").on("click", function(ev){
   document.getElementById("micanvas").style.display="block";
    //function draw() {
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
                        }
                        else{
                                ctx1.fillStyle = "rgb(255, 255, 255)";
                                ctx1.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);
                                ctx2.fillStyle = "rgb(255, 255, 255)";
                                ctx2.fillRect (x*40,y*40,(x+1)* 40,(y+1)*40);
                        }
                }
        }
    //}
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
>>>>>>> 6ffe6bae8ee0eaa4a991901e554b4a19fac4812e*/
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
        socket.emit("nuevoUsuario", {nombre: nombre, contraseña: con1, email: email});
        $('#signupdiv').modal('hide');
    }else{
        alert("Algo va mal");
    }
});

$("#signInC").on("click", function(ev){
    nombre = $("#exampleInputEmail1").val();
    var contraseña = $("#exampleInputPassword1").val();
    socket.emit("signIN", {nombre: nombre, contraseña: contraseña});
});
socket.on("signed", function(bool){
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