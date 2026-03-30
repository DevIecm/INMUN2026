const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const uuidV4 = require('uuid');

const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');

const Usuario = require('../models/usuarios.model');
const { response } = require('express');
const { enviarQRMail } = require('../helpers/correos/correo-envia-qr');
const Comites = require('../models/comites.model');
const FechasComites = require('../models/fechas-comites.model');
const Asistencias = require('../models/asistencias.model');
const { dbConnection } = require('../database/config');

const generaQrYPdf = async (id_usuario = 0, curp, uuid, correo_electronico, nombre_completo) => {
    
    const path_qr = `./uploads/qr/${curp}`;

    try {
        
        const PathNew = `${path_qr}/${uuid}.png`;
        console.log({PathNew});
    
        // Generar el QR
        QRCode.toFile( PathNew , uuid, {
            color: {
                dark: '#8c65aa',  // Blue dots
                // light: '#0000' // Transparent background
            }
        }, function (err) {
            if (err) throw err
            console.log('done');
        });
    
        
        // TODO: Generar el PDF

        await new Promise(resolve => setTimeout(resolve, 500));
    
        const doc = new PDFDocument();
    
        doc.pipe(fs.createWriteStream(`${path_qr}/${uuid}.pdf`));
    
        doc.image('./assets/images/logo-iecm-199x115.png', 90, 15, { fit: [100, 100], align: 'center', valign: 'center' })
        // .rect(90, 15, 100, 100).stroke()
        // .text('Centered', 90, 0);
    
        // Fit the image in the dimensions, and center it both horizontally and vertically
        doc.image('./assets/images/inmun.jpg', 430, 15, { fit: [100, 100], align: 'center', valign: 'center' })
        // .rect(430, 15, 100, 100).stroke()
        // .text('Centered', 430, 0);
    
        doc.text(`${ nombre_completo }, el Modelo de Naciones Unidas`, 100, 200, {
            align: 'center'
        })
            // .moveDown()
            .text('te da la bienvenida, esta será tu identificación y debes llevarla contigo el día del evento.')
    
        console.log({PathNew});
        let path_qr_nrea = path.join(__dirname, `../uploads/qr/${curp}/${uuid}.png`);
        console.log(`${path_qr}/${uuid}.png`);
        console.log(path_qr_nrea);
        

        if(!fs.existsSync(PathNew)){
            console.log('No existe PathNew');
        } else{
            console.log('SIIIIIIIIIIIIIIIIIIIII Existe PathNew');
        }

        console.log('PASA aqui');
        doc.image( PathNew , 200, 270, { fit: [250, 250], align: 'center', valign: 'center' })
            // .rect(230, 300, 150, 150).stroke()
            // .text('QR', 230, 300)
            .moveDown();
    
        // end and display the document in the iframe to the right
        doc.end();

        console.log('Generado!');
    
        const sendQR = await enviarQRMail(id_usuario, correo_electronico, nombre_completo, curp, uuid);
    
        console.log('SEND QR');
        console.log(sendQR);

        return sendQR;
        
    } catch (error) {

        console.log(error);
        return {
            ok: false,
            msg: 'Ocurrió un error al guardar la información - CODE[4]'
        };
        
    }



}

const obtenerQr = async (req, res = response) => {

    const { id_usuario, uuid } = req.params;
    // const uuidOK = uuidv4().validate( uuid );
    const uuidOK = uuidV4.validate( uuid );

    if(!uuidOK){
        return res.status(501).send({
            ok: false,
            msg: 'La información recibida no es válida. Hable con el administrador'
        });
    }

    const usrDB = await Usuario.findOne({ where: { uuid, id_usuario, estado: 4 } });

    if(!usrDB){
        return res.status(501).send({
            ok: false,
            msg: 'No se encontró información relacionada a los parámetros recibidos. Hable con el administrador'
        });
    }

    const { curp } = usrDB;

    const path_qr = path.join(__dirname, `../uploads/qr/${curp}/${uuid}.pdf`);

    if (!fs.existsSync(path_qr)) {
        res.status(400).json({
            ok: false,
            msg: 'No se encontró imagen con dicho nombre'
        });
    }


    res.download(path_qr);
}


const registrarAsistencia = async (req, res = response) => {

    // [x] 1
    const { uuid } = req.params;
    const id_admin = req.id_admin;
    // const uuidOK = uuidv4().validate( uuid );
    const uuidOK = uuidV4.validate( uuid );

    /**
     * ## const fecha_asistencia = (p.ej. hoy 23 de febrero);
     * ## const aviso = res.send(error);
     * [x] 1 -> Recibo el UUID
     * [x] 2 -> Validamos el UUID
     * [x] 3 -> Verificamos el estado del USUARIO
     * [x] 4 -> Verificamos fecha actual (fecha_asistencia)
     * [x] 5 -> Verificamos que el id_comite seleccionado por el USUARIO tenga fechas programadas para (fecha_asistencia)
     * [x] 6 -> Si (fecha_asistencia) existe en la programación de evento ENONCES *avanza* SINO *aviso*
     * [x] 7 -> *avanza* verifica que no exista la asistencia del usuario para ese día
     * [x] 8 -> SI existe ENTONCES *aviso* SINO (paso 9)
     * [-] 9 -> Registrar (INSERTAR) asistencia del usuario y enviar notificacion (o correo)
     */

    // [x] 2
    if(!uuidOK){
        return res.status(501).send({
            ok: false,
            msg: 'La información recibida no es válida. Hable con el administrador'
        });
    }

    // [x] 3
    // El estado 4 es que ya 
    const usrDB = await Usuario.findOne({ where: { uuid } });

    if(!usrDB){
        return res.status(501).send({
            ok: false,
            msg: 'No se encontró información relacionada a los parámetros recibidos. Hable con el administrador'
        });
    }
    
    const { id_comite, id_usuario, nombres, primer_apellido, segundo_apellido, estado } = usrDB;

    if(estado < 4){
        return res.status(501).send({
            ok: false,
            msg: `No es posible registrar la asistencia, se encuentra en estado ${estado}.`
        });
    }


    const nombre_completo = `${nombres.toUpperCase()} ${primer_apellido.toUpperCase()} ${segundo_apellido.toUpperCase()}`;

    // Buscar comité seleccionado por el usuario
    try {

        const countComiteExisteDB = await Comites.count( { where: { estado : 1, id_comite }} );
        console.log(countComiteExisteDB);

        if (!countComiteExisteDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró información del comité seleccionado por el usuario. Hable con el administrador'
            });
        }

        const execute_sp_verifica_dia_asistencia = await dbConnection.query(`EXEC verifica_dia_asistencia ${id_comite}`);

        // @id_comite INT
        console.log('existe: ', execute_sp_verifica_dia_asistencia[0][0].existe);

        // Cuenta con asistencia activa
        if(execute_sp_verifica_dia_asistencia[0][0].existe === 0){
            return res.status(501).send({
                ok: false,
                msg: `El día de hoy no te corresponde asistir a algun evento`,
            });
        }
        
        const execute_sp_asistencia = await dbConnection.query(`EXEC sp_asistencia ${id_comite}, ${id_usuario}, ${id_admin}, 0`);

        // @id_comite INT, @id_usuario INT, @id_admin INT, @tipo_consulta = 0 INS | 1 UPD quitar asistencia
        console.log(execute_sp_asistencia);

        // Cuenta con asistencia activa
        if(execute_sp_asistencia[1] === 0){
            return res.status(501).send({
                ok: false,
                msg: `La asistencia de ${nombre_completo} ya se había registrado anteriormente. Hable con el administrador`,
            });
        }

        /*

        // Correcto! existe el comité seleccionado por el usuario, ahora buscamos las fechas
        const getFechasComiteDB = (await FechasComites.findAll( { attributes: [ 'id_fecha', 'fecha' ], where: { id_comite, estado: 1 } } )).map(el => el.get({ plain: true }))
        if (!getFechasComiteDB) {
            return res.status(404).send({
                ok: false,
                msg: 'No se encontraron fechas disponibles para el comité seleccionado por el usuario. Hable con el administrador'
            });
        }

        console.log(getFechasComiteDB);
        // console.log(getFechasComiteDB);
        // console.log(getFechasComiteDB.length);

        // const fecha_bd = fechasDisponibles.dataValues.fecha;
        
        if(getFechasComiteDB.length <= 0){
            return res.status(404).send({
                ok: false,
                msg: 'No se encontraron fechas disponibles para el comité seleccionado por el usuario. Hable con el administrador'
            });
        }
        
        const todayDate = new Date();
        console.log(todayDate);
        console.log("log directo: ",todayDate.toLocaleString("es-MX", {timeZone: "America/Mexico_City"}))
        // const splitToday = todayDate.split('-');
        // console.log({todayDate});
        const todayConTimezone = todayDate.toLocaleString("es-MX", {timeZone: "America/Mexico_City"});

        const buscarFechaInArray = getFechasComiteDB.find( (post, index) => {
            const fechaFromArray = new Date(`${post.fecha} `);
            const timeZoneFromArray = fechaFromArray.toLocaleString("es-MX", {timeZone: "America/Mexico_City"});
            console.log({todayConTimezone});
            console.log({timeZoneFromArray});
            return (new Date(todayConTimezone) === new Date(timeZoneFromArray))
        });
        console.log('fecha array');
        console.log({buscarFechaInArray});

        if(!buscarFechaInArray){
            console.log('Entra 2');

            // console.log('Entra o');
            return res.status(401).send({
                ok: false,
                msg: 'El día de hoy no te corresponde asistir a algun evento'
            });
        }

        // console.log('');
        const { id_fecha } = buscarFechaInArray;

        // Validar que ya exista asistencia
        const verificarAsistenciaExiste = await Asistencias.count({ where: { id_usuario, id_comite, id_fecha } });

        console.log(verificarAsistenciaExiste);
        if(verificarAsistenciaExiste > 0){
            return res.status(501).send({
                ok: false,
                msg: `La asistencia de ${nombre_completo} ya se había registrado anteriormente. Hable con el administrador`,
            });
        }

        const dataToAsitencia = { id_usuario, id_fecha, id_admin_alta: id_admin, id_comite };

        const insAsistenciaDB = await Asistencias.create( dataToAsitencia );

        if(!insAsistenciaDB){
            return res.status(501).send({
                ok: false,
                msg: 'Ocurrió un error al guardar la información - CODE[N]'
            });
        }

        const id_asistencia = insAsistenciaDB.id_asistencia;

        const verificarEstado5 = await Usuario.count({ where: { id_usuario, id_comite, estado: 5 } });

        console.log(verificarEstado5);
        if(verificarEstado5 === 0){
            // Actualizar a estado 5 (indica que ya cuenta con asistencia)
            const updUsuarioEdo5DB = await Usuario.update({ estado: 5 }, { where: {id_usuario} });
            if(!updUsuarioEdo5DB){
                return res.status(501).send({
                    ok: false,
                    msg: 'Ocurrió un error al guardar la información - CODE[N]'
                });
            }
        }
        */

        // console.log(insAsistenciaDB)

        res.send({
            ok: true,
            msg: `La asistencia de ${nombre_completo} se registró correctamente`,
            nombre_completo,
            id_admin,
            execute_sp_asistencia,
            uuid
            // id_asistencia
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
        
    }

}

const eliminarAsistencia = async (req, res = response) => {

    const { uuid } = req.params;
    const id_admin = req.id_admin;
    // const uuidOK = uuidv4().validate( uuid );
    const uuidOK = uuidV4.validate( uuid );
    if(!uuidOK){
        return res.status(501).send({
            ok: false,
            msg: 'La información recibida no es válida. Hable con el administrador'
        });
    }

    try {

        const usrDB = await Usuario.findOne({ where: { uuid } });

        if(!usrDB){
            return res.status(501).send({
                ok: false,
                msg: 'No se encontró información relacionada a los parámetros recibidos. Hable con el administrador'
            });
        }
        
        const { id_comite, id_usuario, nombres, primer_apellido, segundo_apellido, estado } = usrDB;

        if(estado < 5){
            return res.status(501).send({
                ok: false,
                msg: `No es posible realizar la acción porque se encuentra en estado ${estado}.`
            });
        }

        const nombre_completo = `${nombres.toUpperCase()} ${primer_apellido.toUpperCase()} ${segundo_apellido.toUpperCase()}`;


        const countComiteExisteDB = await Comites.count( { where: { estado : 1, id_comite }} );
        console.log(countComiteExisteDB);

        if (!countComiteExisteDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró información del comité seleccionado por el usuario. Hable con el administrador'
            });
        }

        const execute_sp_asistencia_QUITA = await dbConnection.query(`EXEC sp_asistencia ${id_comite}, ${id_usuario}, ${id_admin}, 1`);

        // @id_comite INT, @id_usuario INT, @id_admin INT, @tipo_consulta = 0 INS | 1 UPD quitar asistencia
        console.log(execute_sp_asistencia_QUITA);

        /* if(execute_sp_asistencia_QUITA[1] === 0){
            return res.status(501).send({
                ok: false,
                msg: `La asistencia de ${nombre_completo} ya se había registrado anteriormente. Hable con el administrador`,
            });
        } */
        
        res.send({
            ok: true,
            msg: `La asistencia de ${nombre_completo} se eliminó correctamente`,
            nombre_completo,
            id_admin,
            execute_sp_asistencia_QUITA
            // id_asistencia
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
        
    }

}


module.exports = {
    generaQrYPdf,
    obtenerQr,
    registrarAsistencia,
    eliminarAsistencia
}


