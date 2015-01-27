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

$("#jugar").on("click", function(ev){
   document.getElementById("micanvas").style.display="block";
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