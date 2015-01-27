//var socket = io('http://localhost:8080');
//socket.on('message', function (data) {
//    console.log(data);
//    socket.emit('send', { my: 'data' });
//});

$("#signin").on("click", function(ev){
    $('#signindiv').modal('show');
});
$("#comosejuega").on("click", function(ev){
    $('#instrucciones').modal('show');
});
$("#signup").on("click", function(ev){
    $('#signupdiv').modal('show');
});