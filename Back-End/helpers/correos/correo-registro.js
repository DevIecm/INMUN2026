const nodemailer = require('nodemailer');
const { dbConnection } = require('../../database/config');
const Usuario = require('../../models/usuarios.model');

const { generarJWTregistro } = require('../jwt-register');

const tokenMailRegister = async ( id_usuario = 0, correo_electronico = '', nombre_completo = '', usuario = '', uuid = '' ) => {

    const user = process.env.CORREO_REMITENTE;
    const pass = process.env.PASS_CORREO;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user, // generated ethereal user
            pass // generated ethereal password
        },
    });

    const MYENVIROMENTWEB = `${process.env.MYENVIROMENTWEB}`;
    const href = `${process.env.APIWEB}`;
    // console.log({href});

    let fecha = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    fecha =  fecha.toLocaleDateString('es-MX', options);

    try {

        // send mail with defined transport object
        const usuariosDB = await Usuario.findOne({ where: { id_usuario, correo_electronico, estado: 0 } });

        // console.log(usuariosDB);

        if (!usuariosDB) {
            return { ok: false, msg: `No se encontró información relacionada al correo <b>${correo_electronico}</b> o la cuenta ya fue activada, favor de verificar` };
        }


        // usuariosDB.forEach( rowUser => {
        
        
        const fecha_token = dbConnection.literal('GETDATE()');
        // const id_usuario = usuariosDB.id_usuario;
        const token_mail = await generarJWTregistro(id_usuario, correo_electronico);

        console.log(new Date());
        console.log({token_mail});

        const saveTokenUsuario = await Usuario.update({ token_mail, fecha_token }, { where: { id_usuario } });

        if (!saveTokenUsuario) {
            return { ok: false, msg: 'Ocurrió un error al generar el token. Ocurrió un error al guardar la información - CODE[3]' };
        }

        let info = await transporter.sendMail({
            from: user, // sender address
            to: `${correo_electronico}`, // list of receivers
            subject: "Continua con tu registro al INMUN 2026", // Subject line
            text: "IECM - INMUN 2026", // plain text body
            html: `<!DOCTYPE html><html lang="es-MX" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width,initial-scale=1"> <meta name="x-apple-disable-message-reformatting"> <title>IECM - Mail</title> <style> table, td, div, h1, p { font-family: Arial, sans-serif; } .p-txt-footer { margin: 0; font-size: 14px; line-height: 16px; font-family: Arial, sans-serif; color: #ffffff; } .txt-p-body { margin: 0 0 12px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; } </style></head><body style="margin:0;padding:0;"> <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;"> <tr> <td align="center" style="padding:0;"> <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;"> <tr> <th align="center" style="padding:40px 0 30px 0;"> <img src="${MYENVIROMENTWEB}/assets/images/miniaturas_Mesa_de_trabajo1.png" alt="" width="200" style="height:auto;display:block;" /> </th> <th align="center" style="padding:40px 0 30px 0;"> <img src="${MYENVIROMENTWEB}/assets/images/inmun.jpg" alt="" width="200" style="height:auto;display:block;" /> </th> </tr> <tr> <td style="padding:36px 30px 42px 30px;" colspan="2"> <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;"> <tr> <td align="right"> Ciudad de México, a ${fecha} </td> </tr> <tr> <td style="padding: 36px 0 36px 0;" align="center"> </td> </tr> <tr align="justify"> <td style="padding:0 0 36px 0;"> <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;"> ${nombre_completo} </h1> <p class="txt-p-body"> Agradecemos tu registro en el sistema del INMUN 2026. </p> <br> <p class="txt-p-body"> Para continuar con el proceso, es necesario que valides tu cuenta de correo electrónico, dando clic en el siguiente enlace: <a href="${MYENVIROMENTWEB}/#/auth/login/${correo_electronico}/${token_mail}/${uuid}" target="_blank" style="color:#ee4c50;text-decoration:underline;"> Clic aquí para activar tu cuenta </a> </p> <p class="txt-p-body"> <b>Usuario</b>: ${usuario} <br>Si no has solicitado la creación de una cuenta, omite este mensaje. </p> </td> </tr> </table> </td> </tr> <tr> <td colspan="2" style="padding:0;width:50%;" align="center"> <p> Este correo se genera automáticamente favor de no responder. </p> </td> </tr> <tr> <td style="padding:30px;background:#5d3f79;" colspan="2"> <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;"> <tr> <td style="padding:0;width:50%;" align="center"> <p class="p-txt-footer">Instituto Electoral de la Ciudad de México &bull; Huizaches 25 &bull; Rancho Los Colorines &bull; Tlalpan &bull; C.P. 14386 &bull; Ciudad de México &bull; Conmutador: <a href="tel:5554833800">(55) 5483 3800</a></p> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table></body></html>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return { ok: true };

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            msg: 'Ocurrió un error al guardar la información - CODE[4] - correo registro'
        };
    }

}

// envio de constancia
const ConstanciaMailRegister = async ( id_usuario = 0, correo_electronico = '', nombre_completo = '', usuario = '', uuid = '' ) => {

    console.log("ConstanciaMailRegister", { id_usuario, correo_electronico, nombre_completo, usuario, uuid });
    const user = process.env.CORREO_REMITENTE;
    const pass = process.env.PASS_CORREO;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user, // generated ethereal user
            pass // generated ethereal password
        },
    });

    const MYENVIROMENTWEB = `${process.env.MYENVIROMENTWEB}`;
    const href = `${process.env.APIWEB}`;
    // console.log({href});

    let fecha = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    fecha =  fecha.toLocaleDateString('es-MX', options);

    try {

        // send mail with defined transport object
        const usuariosDB = await Usuario.findOne({ where: { id_usuario, correo_electronico, estado: 4 } });

        // console.log(usuariosDB);

        if (!usuariosDB) {
            return { ok: false, msg: `No se encontró información relacionada al correo <b>${correo_electronico}</b> o la cuenta ya fue activada, favor de verificar` };
        }


        // usuariosDB.forEach( rowUser => {
        
        
        const fecha_token = dbConnection.literal('GETDATE()');
        // const id_usuario = usuariosDB.id_usuario;
        const token_mail = await generarJWTregistro(id_usuario, correo_electronico);

        console.log(new Date());
        console.log({token_mail});

        const saveTokenUsuario = await Usuario.update({ token_mail, fecha_token }, { where: { id_usuario } });

        if (!saveTokenUsuario) {
            return { ok: false, msg: 'Ocurrió un error al generar el token. Ocurrió un error al guardar la información - CODE[3]' };
        }

        let info = await transporter.sendMail({
            from: user, // sender address
            to: `${correo_electronico}`, // list of receivers
            subject: "¡Te damos la bienvenida al INMUN!", // Subject line
            text: "IECM - INMUN 2026", // plain text body
            html: `<!DOCTYPE html><html lang="es-MX" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width,initial-scale=1"> <meta name="x-apple-disable-message-reformatting"> <title>IECM - Mail</title> <style> table, td, div, h1, p { font-family: Arial, sans-serif; } .p-txt-footer { margin: 0; font-size: 14px; line-height: 16px; font-family: Arial, sans-serif; color: #ffffff; } .txt-p-body { margin: 0 0 12px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; } </style></head><body style="margin:0;padding:0;"> <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;"> <tr> <td align="center" style="padding:0;"> <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;"> <tr> <th align="center" style="padding:40px 0 30px 0;"> <img src="${MYENVIROMENTWEB}/assets/images/miniaturas_Mesa_de_trabajo1.png" alt="" width="200" style="height:auto;display:block;" /> </th> <th align="center" style="padding:40px 0 30px 0;"> <img src="${MYENVIROMENTWEB}/assets/images/inmun.jpg" alt="" width="200" style="height:auto;display:block;" /> </th> </tr> <tr> <td style="padding:36px 30px 42px 30px;" colspan="2"> <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;"> <tr> <td align="right"> Ciudad de México, a ${fecha} </td> </tr> <tr> <td style="padding: 36px 0 36px 0;" align="center"> </td> </tr> <tr align="justify"> <td style="padding:0 0 36px 0;"> <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;"> ${nombre_completo} </h1> <p class="txt-p-body"> Gracias por tu interés en participar en la VII edición del INMUN. </p> <br> <p class="txt-p-body">En este momento hay varias personas en proceso de registro, en caso de que aun haya vacantes, en breve el sistema te hará llegar la liga para continuar con tu registro.</p></p> <p class="txt-p-body">Si no has solicitado la creación de una cuenta, omite este mensaje. </p> </td> </tr> </table> </td> </tr> <tr> <td colspan="2" style="padding:0;width:50%;" align="center"> <p> Este correo se genera automáticamente favor de no responder. </p> </td> </tr> <tr> <td style="padding:30px;background:#5d3f79;" colspan="2"> <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;"> <tr> <td style="padding:0;width:50%;" align="center"> <p class="p-txt-footer">Instituto Electoral de la Ciudad de México &bull; Huizaches 25 &bull; Rancho Los Colorines &bull; Tlalpan &bull; C.P. 14386 &bull; Ciudad de México &bull; Conmutador: <a href="tel:5554833800">(55) 5483 3800</a></p> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table></body></html>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return { ok: true };

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            msg: 'Ocurrió un error al guardar la información - CODE[4] - correo registro'
        };
    }

}

const MailRegister = async ( id_usuario = 0, correo_electronico = '', nombre_completo = '', usuario = '', uuid = '' ) => {

    const user = process.env.CORREO_REMITENTE;
    const pass = process.env.PASS_CORREO;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user, // generated ethereal user
            pass // generated ethereal password
        },
    });

    const MYENVIROMENTWEB = `${process.env.MYENVIROMENTWEB}`;
    const href = `${process.env.APIWEB}`;
    // console.log({href});

    let fecha = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    fecha =  fecha.toLocaleDateString('es-MX', options);

    try {

        // send mail with defined transport object
        const usuariosDB = await Usuario.findOne({ where: { id_usuario, correo_electronico, estado: 0 } });

        // console.log(usuariosDB);

        if (!usuariosDB) {
            return { ok: false, msg: `No se encontró información relacionada al correo <b>${correo_electronico}</b> o la cuenta ya fue activada, favor de verificar` };
        }


        // usuariosDB.forEach( rowUser => {
        
        
        const fecha_token = dbConnection.literal('GETDATE()');
        // const id_usuario = usuariosDB.id_usuario;
        const token_mail = await generarJWTregistro(id_usuario, correo_electronico);

        console.log(new Date());
        console.log({token_mail});

        const saveTokenUsuario = await Usuario.update({ token_mail, fecha_token }, { where: { id_usuario } });

        if (!saveTokenUsuario) {
            return { ok: false, msg: 'Ocurrió un error al generar el token. Ocurrió un error al guardar la información - CODE[3]' };
        }

        let info = await transporter.sendMail({
            from: user, // sender address
            to: `${correo_electronico}`, // list of receivers
            subject: "¡Te damos la bienvenida al INMUN!", // Subject line
            text: "IECM - INMUN 2026", // plain text body
            html: `<!DOCTYPE html><html lang="es-MX" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width,initial-scale=1"> <meta name="x-apple-disable-message-reformatting"> <title>IECM - Mail</title> <style> table, td, div, h1, p { font-family: Arial, sans-serif; } .p-txt-footer { margin: 0; font-size: 14px; line-height: 16px; font-family: Arial, sans-serif; color: #ffffff; } .txt-p-body { margin: 0 0 12px 0; font-size: 16px; line-height: 24px; font-family: Arial, sans-serif; } </style></head><body style="margin:0;padding:0;"> <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;"> <tr> <td align="center" style="padding:0;"> <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;"> <tr> <th align="center" style="padding:40px 0 30px 0;"> <img src="${MYENVIROMENTWEB}/assets/images/miniaturas_Mesa_de_trabajo1.png" alt="" width="200" style="height:auto;display:block;" /> </th> <th align="center" style="padding:40px 0 30px 0;"> <img src="${MYENVIROMENTWEB}/assets/images/inmun.jpg" alt="" width="200" style="height:auto;display:block;" /> </th> </tr> <tr> <td style="padding:36px 30px 42px 30px;" colspan="2"> <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;"> <tr> <td align="right"> Ciudad de México, a ${fecha} </td> </tr> <tr> <td style="padding: 36px 0 36px 0;" align="center"> </td> </tr> <tr align="justify"> <td style="padding:0 0 36px 0;"> <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;"> ${nombre_completo} </h1> <p class="txt-p-body"> Gracias por tu interés en participar en la VII edición del INMUN. </p> <br> <p class="txt-p-body">En este momento hay varias personas en proceso de registro, en caso de que aun haya vacantes, en breve el sistema te hará llegar la liga para continuar con tu registro.</p></p> <p class="txt-p-body">Si no has solicitado la creación de una cuenta, omite este mensaje. </p> </td> </tr> </table> </td> </tr> <tr> <td colspan="2" style="padding:0;width:50%;" align="center"> <p> Este correo se genera automáticamente favor de no responder. </p> </td> </tr> <tr> <td style="padding:30px;background:#5d3f79;" colspan="2"> <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;"> <tr> <td style="padding:0;width:50%;" align="center"> <p class="p-txt-footer">Instituto Electoral de la Ciudad de México &bull; Huizaches 25 &bull; Rancho Los Colorines &bull; Tlalpan &bull; C.P. 14386 &bull; Ciudad de México &bull; Conmutador: <a href="tel:5554833800">(55) 5483 3800</a></p> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table></body></html>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return { ok: true };

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            msg: 'Ocurrió un error al guardar la información - CODE[4] - correo registro'
        };
    }

}

module.exports = {
    MailRegister,
    ConstanciaMailRegister,
    tokenMailRegister
}