var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gameupv@gmail.com',
            pass: 'hundirlaflota'
        },
        debug: true
    });
function mail(to, hash, callback){
    transporter.sendMail({
        subject: "GAME - UPV mail verification",
        html: "<h2>GAME - UPV mail verification</h2>\
        <p>Este correo ha sido enviado para la verificación de un nuevo usuario.</p>\
        <p>Si usted no ha querido registrarse en nuestros servicios, borre el mensaje.</p>\
        <p>En caso de que usted haya solicitado crear la cuenta, entre en el siguiente enlace:</p>\
        <a href='https://localhost:4433/signup?hash="+hash+"&email="+to+"'>ENLACE</a>",
        from: 'gameupv@gmail.com',
        to: to
    }, callback);
}

function friendMail(to, callback){
    transporter.sendMail({
        subject: "GAME - UPV petición de amistad",
        html: "<h2>GAME - UPV peticion de amistad</h2>\
        <p>aqui va el email que queramos mandar</p>",
        from: 'gameupv@gmail.com',
        to: to
    }, callback);
}

module.exports.sendMail = mail;
module.exports.friendMail =friendMail;