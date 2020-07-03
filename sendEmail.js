const AWS = require('aws-sdk')

AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_KEY_ACCESS
});

const ses = new AWS.SES({
    apiVersion: process.env.API_VERSION
});

module.exports.handle = (event, context, callback) => {

    const {
        clc_appointment_id,
        dateEmailTemplate,
        hour: time,
        firstname,
        lastname,
        email
    } = event.data

    const {
        token
    } = event.appointment

    const params = {
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `<!DOCTYPE html>
                    <html>
                    <header>
                        <link href='http://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'>
                    </header>
                    
                    <body>
                        <div style="background-color:#ffffff; font-family: Lato, sans-serif; color: #424242;">
                            <div style="margin: 0 auto; max-width: 640px">
                    
                                <div style="padding-left: 0.5em; padding-top: 1em; padding-bottom: 2em">
                                    <img style="width: 240px; max-width: 100%"
                                        src="https://d258ww5vwztyuo.cloudfront.net/images/logo-sm.jpg">
                                </div>
                                ​
                                <div style="padding-left: 1em;">
                                    <p>Estimado <b>${firstname} ${lastname}</b></p>
                                    ​
                                    <p>
                                        Por medio de este mail, confirmamos que tu cita ha quedado registrada con éxito para el día
                                        <b>${dateEmailTemplate} a las ${time}</b> con el Dr. <b>${event.professional}</b>,
                                        en el Centro de Telemedicina. El número de reserva de tu cita es: <b>${clc_appointment_id}</b>
                                    </p>
                                    ​<p>Para ingresar a tu consulta debes ingresar al siguiente enlace:</p>
                                    <a style="color: #6B7CFF;" href="https://telemedicina.clinicalascondes.cl/${token}">
                                        https://telemedicina.clinicalascondes.cl/${token}
                                    </a>
                                    ​
                                    <p>
                                        <b style="text-decoration: underline;">Recomendaciones para el día de tu cita: </b>
                                    </p>
                                    ​
                                    <ul>
                                        <li>Recomendamos que te conectes <b>15 minutos antes de la cita</b>, para comprobar que tu cámara,
                                            micrófono y parlante funcione correctamente.</li>
                                        <li>Idealmente usar un notebook o desktop
                                            para realizar la video llamada, sin embargo, también se puede realizar desde dispositivos
                                            móviles como tables o celulares.</li>
                                        <li>Contar con una buena y estable conexión a internet.</li>
                                        <li>Escoger un lugar tranquilo y sin ruido.</li>
                                    </ul>
                    
                                    ​
                                    <p>
                                        En la plataforma de atención, podrás <b>adjuntar archivos (clip)</b>, tales
                                        como exámenes, recetas o cualquier otro documento que sea importante y necesario para la evaluación
                                        del médico.
                                    </p>
                    
                                    <p>
                                        Si presentas algún inconveniente en la conexión, favor escribe a <a style="color: #6B7CFF"
                                            href="contactotelemedicina@clinicalascondes.cl">contactotelemedicina@clinicalascondes.cl.</a>
                                    </p>
                                    ​
                                    ​
                                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin-top: 2em;">
                                    ​
                                    <p style="text-align: center;">Muchas gracias</p>
                                    <p style="text-align: center;">Centro de Telemedicina</p>
                                    <p style="text-align: center;">Clínica Las Condes</p>
                                    <p style="text-align: center; padding-top: 2em; padding-bottom: 2em;">
                                        <a href="#" style="color: #6B7CFF">Términos y condiciones</a>
                                    </p>
                                </div>
                            </div>
                    </body>
                    ​
                    
                    </html>`
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Recordatorio cita telemedicina'
            }
        },
        Source: '"Clinica Las Condes" <no-reply@dev.av-clc.final.cl>',
    };

    ses.sendEmail(params, (err, data) => {
        if (err) {
            console.log(err, err.stack)
            callback(null, err, err.stack)
        } else {
            console.log("Email sent.", data)
            callback(null, 'Email send ', data)
        }
    })
};