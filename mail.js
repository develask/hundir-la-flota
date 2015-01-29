var nodemailer = require('nodemailer');
function mail(to, hash, callback){
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gameupv@gmail.com',
            pass: 'hundirlaflota'
        },
        debug: true
    });
    transporter.sendMail({
        subject: "GAME - UPV mail verification",
        html: "<a href='localhost:8080/signup?hash="+hash+"&email="+to+"'>localhost:8080/signup?hash="+hash+"&email="+to+"</a>",
        from: 'gameupv@yahoo.es',
        to: to
    }, callback);
}
module.exports.sendMail = mail;