var nodemailer = require('nodemailer');
function mail(datos, callback){
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gameupv@gmail.com',
            pass: 'hundirlaflota'
        },
        debug: true
    });
    transporter.sendMail(datos, callback);
}
function verificationMail(to, hash, callback){
    mail({
        subject: "GAME - UPV mail verification",
        html: "<h2>GAME - UPV mail verification</h2><p>Este correo ha sido enviado para la verificación de un nuevo usuario.</p><p>Si usted no ha querido registrarse en nuestros servicios, borre el mensaje.</p><p>En caso de que usted haya solicitado crear la cuenta, entre en el siguiente enlace:</p><a href='https://10.42.0.13:4433/signup?hash="+hash+"&email="+to+"'>ENLACE</a>",
        from: 'gameupv@gmail.com',
        to: to
    }, callback);
}
function passRecover(to, hash, callback){
    mail({
        subject: "GAME - UPV pass recovery",
        html: "<h2>GAME - UPV mail verification</h2><p>Este correo ha sido enviado para la recuperacion de la cuenta.</p><p>Si usted ha pedido la recuperacion de la cuenta asociada a este email, entre en el siguiente enlace antes de 24 horas.</p><a href='https://10.42.0.13:4433/forgotenPass?hash="+hash+"&email="+to+"'>ENLACE</a>",
        from: 'gameupv@gmail.com',
        to: to
    }, callback);
}
module.exports.verificationMail = verificationMail;
module.exports.passRecover = passRecover;
