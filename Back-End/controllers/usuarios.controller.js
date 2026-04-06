// const fs = require('fs');
const fse = require('fs-extra');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const Usuario = require("../models/usuarios.model");

const { tokenMailRegister, MailRegister, ConstanciaMailRegister } = require("../helpers/correos/correo-registro");
const { dbConnection } = require('../database/config');
const PermisosAutorizaciones = require('../models/permisos-autorizaciones');
const { generaQrYPdf } = require('./qr.controller');
const UsuarioEliminado = require('../models/usuarios-eliminados');
const Comites = require('../models/comites.model');

const crearUsuario = async (req, res = response) => {

    const data = req.body;

    // console.log(data);
    const { contrasena, nombres, primer_apellido, segundo_apellido, correo_electronico, curp, usuario } = data;
    // console.log({nombres, apellido_paterno, apellido_materno});
    const nombre_completo = `${nombres.toUpperCase()} ${primer_apellido.toUpperCase()} ${segundo_apellido.toUpperCase()}`;
    // console.log({nombre_completo});

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    data.contrasena = bcrypt.hashSync(contrasena, salt);

    const uuid = uuidv4();
    data.uuid = uuid;

    try {

        const countByCRUPDB = await Usuario.count( { where: { curp }} );

        if(countByCRUPDB > 0){
            return res.status(401).send({
                ok: false,
                msg: `La curp ${curp} ya se encuentra registrada en el INMUN, hable con el admininstrador`
            });
        }
        
        /* const countByCorreoDB = await Usuario.count( { where: { correo_electronico }} );

        if(countByCorreoDB > 0){
            return res.status(401).send({
                ok: false,
                msg: `El correo electrónico ${correo_electronico} ya se encuentra registrado en el INMUN, hable con el admininstrador`
            });
        } */

        // console.log({nombre_completo});
        const usuarioDB = await Usuario.create(data);
        const { id_usuario } = usuarioDB;
        // console.log({id_usuario});

        if (usuarioDB) {
            const correoAlta = await MailRegister(id_usuario, correo_electronico, nombre_completo, usuario, uuid);
            console.log({ correoAlta });
            if (correoAlta.ok) {
                console.log('Todo bien!');
                res.send({
                    ok: true,
                    usuarioDB,
                    msg: 'La cuenta se creó correctamente, por favor revisa tu correo electrónico.'
                });
            } else {
                console.log('Ocurrió un error');
                return res.status(501).send({
                    ok: false,
                    msg: correoAlta.msg
                });
            }
        } else {
            return res.status(501).send({
                ok: false,
                msg: 'Ocurrió un error al guardar la información - CODE[1]'
            });
        }


    } catch (error) {

        console.log(error);

        return res.status(403).send({
            ok: false,
            msg: 'Ocurrió un error al guardar la información - CODE[2]'
        });

    }

}

const eliminarUsuario = async (req, res = response) => {

    const { id_usuario } = req.params;

    try {

        const eliminarUsuarioDB = await Usuario.destroy({ where: { id_usuario }, force: true });

        if (!eliminarUsuarioDB) {
            return res.status(500).send({
                ok: false,
                msg: 'Ocurrió un error al eliminar la información - CODE[U2]'
            });
        }

        res.send({
            ok: true,
            msg: '¡La cuenta se eliminó correctamente!'
        });

    } catch (error) {

        console.log(error);

        return res.status(403).send({
            ok: false,
            msg: 'Ocurrió un error al eliminar la información - CODE[U3]'
        });

    }

}

const complementarInformacion = async (req, res = response) => {

    // Validar que exista un archivo
    const id_usuario = req.id_usuario;
    // console.log({clave_elector});

    // Contiene archivo

    // Procesar la imagen...

    const data = req.body;
    const fecha_complementa_informacion = dbConnection.literal('GETDATE()');
    data.fecha_complementa_informacion = fecha_complementa_informacion;
    data.estado = 2;
    console.log(data);



    try {

        // TODO: Preguntar si en cualquier estado podrá editar información
        const updComplementaInfoDB = await Usuario.update(data, { where: { id_usuario } });

        if (!updComplementaInfoDB) {
            return res.status(500).send({
                ok: false,
                msg: 'Ocurrió un error al guardar la información - CODE[3]'
            });
        }


        res.send({
            ok: true,
            msg: '¡La información se guardó correctamente!'
        });

    } catch (error) {

        console.log(error);
        return res.status(500).send({
            status: false,
            msg: "Hable con el administrador CODE[4] usuario ctrl"
        });

    }
    // console.log(data);
}

const enviarConstanciaUsuario = async (req, res = response) => {

    const id_usuario = req.id_usuario;

    console.log("++++++++++++++++++++++", id_usuario);

    try {

        const infoUsuarioDB = await Usuario.findOne({ where: { id_usuario } });

        console.log("+++++++++++++++++++++", {infoUsuarioDB});
        if (!infoUsuarioDB) {
            return res.status(401).send({
                ok: false,
                msg: 'No se encontró información del usuario'
            });
        }

        const sendEmail = await ConstanciaMailRegister(id_usuario, infoUsuarioDB.correo_electronico, `${infoUsuarioDB.nombres} ${infoUsuarioDB.primer_apellido} ${infoUsuarioDB.segundo_apellido}`, infoUsuarioDB.usuario, infoUsuarioDB.uuid);

        console.log({sendEmail});

        if (sendEmail.ok) {
            console.log('Correo enviado correctamente');
            res.send({
                ok: true,
                msg: 'En tu correo electrónico, encontrarás tu constancia de participación en el INMUN 2025.'
            });
        } else {
            console.log('Ocurrió un error al enviar el correo');
            return res.status(501).send({
                ok: false,
                msg: sendEmail.msg
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const permisosYAutorizaciones = async (req, res = response) => {

    const id_usuario = req.id_usuario;

    console.log({id_usuario});


    const data = req.body;
    
    data.id_usuario = id_usuario;
    console.log(data);

    try {

        const verifyInfoUsuario = await Usuario.findOne({  where: {id_usuario, estado: 3} });

        if (!verifyInfoUsuario) {
            return res.status(401).send({
                ok: false,
                msg: 'No cuenta con las condiciones para actualizar esta información!'
            });
        }

        let { curp, uuid, correo_electronico, nombres, primer_apellido, segundo_apellido, id_comite, edad } = verifyInfoUsuario;

        data.menor_edad = 0;
        if(edad < 18){
            data.menor_edad = 1;
        }

        /**NUEVO AGREGADO EL DÍA MARTES 28 DE MARZO DEL 2023 */
        // let { id_comite } = req.params;
        id_comite = Number(id_comite);

        if (isNaN(id_comite)) {
            return res.status(401).json({
                ok: false,
                msg: 'No se recibieron parámetros válidos'
            });
        }

        try {

            const lugaresdisponiblesComiteDB = await Comites.findOne({ attributes: ['id_comite', 'lugares_disponibles', 'cupo'], where: { id_comite, estado: 1 } });

            if (!lugaresdisponiblesComiteDB) {
                return res.status(401).json({
                    ok: false,
                    msg: 'No se encontró información del comité seleccionado'
                });
            }

            const { lugares_disponibles, cupo } = lugaresdisponiblesComiteDB;
            console.log(lugares_disponibles);

            if (lugares_disponibles <= 0) {

                // Pasar a null id_comite y estado a 2
                const upUsuarioComiteNull = Usuario.update( {id_comite: null, estado: 2}, { where: { id_usuario } } );
                if (!upUsuarioComiteNull) {
                    return res.status(500).send({
                        ok: false,
                        msg: 'Ocurrió un error al guardar la información - CODE[U1]'
                    });
                }

                return res.status(401).send({
                    ok: false,
                    msg: 'El comité que habías seleccionado ya no cuenta con lugares disponibles, pero podrás seleccionar otro comité cerrando este mensaje y regresando a la pestaña "Selección de comité".',
                    lugares_disponibles,
                    con_lugar: false
                });

            }

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[L9]'
            });
        }

        /**NUEVO AGREGADO EL DÍA MARTES 28 DE MARZO DEL 2023 */

        const nombre_completo = `${nombres.toUpperCase()} ${primer_apellido.toUpperCase()} ${segundo_apellido.toUpperCase()}`;
        
        const insPermisosDB = await PermisosAutorizaciones.create(data);

        if (!insPermisosDB) {
            return res.status(500).send({
                ok: false,
                msg: 'Ocurrió un error al guardar la información - CODE[5]'
            });
        }

        

        const updPermisosUsuario = await Usuario.update({ estado: 4 }, { where: { id_usuario } });

        if (!updPermisosUsuario) {
            return res.status(500).send({
                ok: false,
                msg: 'Ocurrió un error al guardar la información - CODE[6]'
            });
        }

        // Crear directorio
        const path_curp = `./uploads/qr/${curp}`;

        if(!fse.existsSync(path_curp)){
            fse.mkdirSync(path_curp);
        }
        
        // Envío de correo con QR

        const QR = await generaQrYPdf( id_usuario, curp, uuid, correo_electronico, nombre_completo );
        console.log({QR});

        const { ok, msg = '' } = QR;

        if(!ok){
            console.log(QR);
            return res.status(500).send({
                ok: false,
                msg: 'Error en generación y envío de QR'
            });
        }


        console.log(msg);
        res.send({
            ok: true,
            msg: 'Los permisos y autorizaciones se guardaron correctamente. En tu correo electrónico, encontrarás tu Código QR que te servirá para pasar lista de asistencia los días del evento, por lo que lo deberás llevar impreso o en medio digital.'
        });

    } catch (error) {


        console.log(error);
        return res.status(500).send({
            status: false,
            msg: "Hable con el administrador CODE [7]"
        });

    }



    // console.log(data);


}

const getUsuarioById = async (req, res = response) => {

    const { id_usuario } = req.params;

    try {

        // TODO: Indicar los atributos necesarios
        const usuarioDB = await Usuario.findOne({ where: { id_usuario } });

        if (!usuarioDB) {
            return res.status(401).json({
                ok: false,
                msg: 'No se encontró usuario con el id indicado'
            });
        }

        res.send({
            ok: true,
            usuarioDB
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const getPermisoId = async (req, res = response) => {

    const id_usuario = req.id_usuario;

    try {

        // TODO: Indicar los atributos necesarios
        const permisoDB = await PermisosAutorizaciones.findOne({ where: { id_usuario } });

        if (!permisoDB) {
            return res.status(401).json({
                ok: false,
                msg: 'No se encontró usuario con el id indicado'
            });
        }

        res.send({
            ok: true,
            permisoDB
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const suscribirAComite = async (req, res = response) => {

    const data = req.body;

    console.log(data);

    const id_usuario = req.id_usuario;

    const fecha_selecciona_comite = dbConnection.literal('GETDATE()');

    try {
        
        let { id_comite } = data;

        /**NUEVO AGREGADO EL DÍA MARTES 28 DE MARZO DEL 2023 */
        // let { id_comite } = req.params;
        id_comite = Number(id_comite);

        if (isNaN(id_comite)) {
            return res.status(401).json({
                ok: false,
                msg: 'No se recibieron parámetros válidos'
            });
        }

        try {

            const lugaresdisponiblesComiteDB = await Comites.findOne({ attributes: ['id_comite', 'lugares_disponibles', 'cupo'], where: { id_comite, estado: 1 } });

            if (!lugaresdisponiblesComiteDB) {
                return res.status(401).json({
                    ok: false,
                    msg: 'No se encontró información del comité seleccionado'
                });
            }

            const { lugares_disponibles, cupo } = lugaresdisponiblesComiteDB;
            console.log(lugares_disponibles);

            if(lugares_disponibles <= 0){

                return res.status(401).send({
                    ok: false,
                    msg: 'El comité que habías seleccionado ya no cuenta con lugares disponibles, pero podrás seleccionar otro comité cerrando este mensaje.',
                    lugares_disponibles,
                    con_lugar: false
                });
                
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[L9]'
            });
        }

    // console.log(exe_query_ListadoValidacion);


        /**NUEVO AGREGADO EL DÍA MARTES 28 DE MARZO DEL 2023 */

        // const updSeleccionComiteDB = true;
        const updSeleccionComiteDB = await Usuario.update({ id_comite, fecha_selecciona_comite, estado: 3 }, { where: { id_usuario } });

        if (!updSeleccionComiteDB) {
            return res.status(500).send({
                ok: false,
                msg: 'Ocurrió un error al guardar la información - CODE[8]'
            });
        }


        res.send({
            ok: true,
            msg: '¡La información se guardó correctamente!',
            con_lugar: true,
        });

    } catch (error) {

        console.log(error);

        return res.status(403).send({
            ok: false,
            msg: 'Ocurrió un error al guardar la información - CODE[9]'
        });

    }
}

const avanceRegistro = async (req, res = response) => {

    const id_usuario = req.id_usuario;

    try {

        const avanceRegistroDB = await Usuario.findOne({ attributes: ['id_usuario', 'estado'], where: { id_usuario } });
        if (!avanceRegistroDB) {
            return res.status(403).send({
                ok: false,
                msg: 'No se encontró información del usuario'
            });
        }
        console.log({avanceRegistroDB});
        res.send({
            ok: true,
            msg: 'Avance del registro',
            avanceRegistroDB
        });

    } catch (error) {
        console.log(error);

        return res.status(403).send({
            ok: false,
            msg: 'Ocurrió un error al obtener la información - CODE[N]'
        });
    }

}

const eliminarCuentaUsuario = async (req, res = response) => {

    const { id_comite, id_usuario } = req.params;

    try {

        // Obtener información del usuario para después insertarla
        const getDataUsrDB = await Usuario.findOne({ where: { id_usuario, id_comite, estado: 4 } });

        if(!getDataUsrDB){
            return res.status(404).send({
                ok: false,
                msg: 'No se encontró información'
            });
        }

        // console.log(getDataUsrDB.dataValues);
        const { 
            // fecha_nacimiento,
            fecha_selecciona_comite,
            // fecha_alta,
            fecha_baja,
            fecha_activa_cuenta,
            fecha_actualiza_contrasena,
            fecha_token,
            fecha_complementa_informacion, ...resto  } = getDataUsrDB.dataValues;

        // Insertar información del usuario
        const insertUsrHistorico = await UsuarioEliminado.create( resto );

        if(!insertUsrHistorico){
            return res.status(501).send({
                ok: false,
                msg: 'No se pudo guardar la información histórica'
            });
        }

        // Eliminar la información del usuario
        const eliminarUsrDB = await Usuario.destroy( { where: { id_usuario, id_comite, estado: 4 }, force: true } );

        if(!eliminarUsrDB){
            return res.status(501).send({
                ok: false,
                msg: 'No se pudo eliminar la información del usuario'
            });
        }
        
        res.send({
            ok: true,
            msg: 'La cuenta se eliminó correctamente',
            // getDataUsrDB,
            // insertUsrHistorico,
            eliminarUsrDB
        });

    } catch (error) {

        console.log(error);

        return res.status(403).send({
            ok: false,
            msg: 'Ocurrió un error al guardar la información - CODE[20]'
        });

    }
}

const obtenerListaUsuariosValidacion = async (req, res = response) => {

    try {

        const usuariosValidacionDB = await Usuario.findAll({ attributes: ['id_usuario', 'nombres', 'primer_apellido', 'segundo_apellido', 'validado', 'estado'] });
        
        res.send({
            ok: true,
            usuariosValidacionDB
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const validarRegistroPorUsuario = async (req, res = response) => {

    try {

        const { id_usuario } = req.params;

        // console.log(id_usuario);
        // return;

        const usrToValidateDB = await Usuario.findOne({ attributes: ['correo_electronico', 'nombres', 'primer_apellido', 'segundo_apellido', 'usuario', 'uuid'], where: { id_usuario } });

        if(!usrToValidateDB){
            return res.status(501).send({
                ok: false,
                msg: `No se encontró información relacionada al usuario con id ${id_usuario}`
            });
        }

        const { nombres, primer_apellido, segundo_apellido, correo_electronico, usuario, uuid } = usrToValidateDB;
        const nombre_completo = `${nombres.toUpperCase()} ${primer_apellido.toUpperCase()} ${segundo_apellido.toUpperCase()}`;
    

        const fecha_validado = dbConnection.literal('GETDATE()');

        const updUsuarioValidateDB = await Usuario.update({ validado: 1, fecha_validado  }, { where: { id_usuario } });

        if (updUsuarioValidateDB) {
            const correoAlta = await tokenMailRegister(id_usuario, correo_electronico, nombre_completo, usuario, uuid);
            console.log({ correoAlta });
            if (correoAlta.ok) {
                console.log('Todo bien!');
                res.send({
                    ok: true,
                    usuarioDB: usrToValidateDB,
                    msg: 'Registro validado correctamente.'
                });
            } else {
                console.log('Ocurrió un error');
                return res.status(501).send({
                    ok: false,
                    msg: correoAlta.msg
                });
            }
        } else {
            return res.status(501).send({
                ok: false,
                msg: 'Ocurrió un error al guardar la información - CODE[1]'
            });
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

module.exports = {
    crearUsuario,
    eliminarUsuario,
    complementarInformacion,
    getUsuarioById,
    suscribirAComite,
    permisosYAutorizaciones,
    getPermisoId,
    avanceRegistro,
    eliminarCuentaUsuario,
    obtenerListaUsuariosValidacion,
    validarRegistroPorUsuario,
    enviarConstanciaUsuario
}