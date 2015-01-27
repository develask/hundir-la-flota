var socket = io('http://localhost:8080');
socket.on('message', function (data) {
    console.log(data);
    socket.emit('send', { my: 'data' });
});