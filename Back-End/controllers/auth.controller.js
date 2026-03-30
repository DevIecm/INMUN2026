const { response } = require("express");

const Usuario = require("../models/usuarios.model");

const bcrypt = require("bcrypt");

const { generarJWT } = require("../helpers/jwt");
const { dbConnection } = require("../database/config");
const { getMenuFrontEnd } = require("../helpers/menu-frontend");
const { recuperarContrasenaMail } = require("../helpers/correos/correo-recuperacion-contrasena");
const { generarJWTregistro } = require("../helpers/jwt-register");


const login = async (req, res = response) => {

    const { usuario, contrasena } = req.body;

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ where: { usuario } });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario o contraseña incorrecta'
            });
        }

        // Verificar contraseña      
        const validPassword = bcrypt.compareSync( contrasena, usuarioDB.contrasena );
        // const validPassword = bcrypt.compareSync( contrasena, usuarioDB.password );
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrecta'
            });
        }

        if (!usuarioDB.validado) {
            return res.status(400).send({
                ok: true,
                msg: 'Estamos validando tu información, en caso de ser procedente recibirás un nuevo correo electrónico con indicaciones para finalizar tu registro',
                cuenta_activa: false
            });
        }

        if (usuarioDB.estado === 0) {
            return res.status(400).send({
                ok: true,
                msg: 'Confirma tu cuenta, abre el enlace que llegó a tu correo',
                cuenta_activa: false
            });
        }

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id_usuario);

        // TODO: Regresar el menú

        res.json({
            ok: true,
            cuenta_activa: true,
            token,
            menu: getMenuFrontEnd( usuarioDB.perfil, usuarioDB.nombres )
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[L1]'
        })
    }

}

const renewToken = async (req, res = response) => {
    const id_usuario = req.id_usuario;
    const clave_elector = req.clave_elector;
    // console.log(id_usuario);
    // console.log(req)
    // Generar el TOKEN - JWT
    const token = await generarJWT(id_usuario, clave_elector);

    // Obtener el usuario por id
    const usuarioDB = await Usuario.findOne({ where: { id_usuario } });
    // const usuarioDB =  await Usuario.findOne({ where: {correo_electronico}});

    if (!usuarioDB) {
        return res.status(401).json({
            ok: false,
            msg: `No sencontró un usuario con el id ${id_usuario}`
        });
    }

    res.json({
        ok: true,
        token,
        usuarioDB,
        menu: getMenuFrontEnd(usuarioDB.perfil, usuarioDB.nombres)
    })
}

const activarCuenta = async (req, res = response) => {

    const { correo_electronico, token_mail, uuid } = req.params;

    if (!correo_electronico || !token_mail || !uuid) {
        return res.status(500).send({
            ok: false,
            msg: 'No se recibieron los atributos necesarios'
        });
    }

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ where: { correo_electronico, token_mail, uuid, estado: 0 } });

        if (!usuarioDB) {
            return res.status(404).send({
                ok: false,
                msg: 'El correo electrónico o el token son incorrectos, favor de validar'
            });
        }
        
        if(!usuarioDB.validado){
            return res.status(404).send({
                ok: false,
                msg: 'No tienes permisos para realizar esta acción'
            });
        }

        const fecha_activa_cuenta = dbConnection.literal('GETDATE()');
        const activarUsuarioDB = await Usuario.update({ estado: 1, fecha_activa_cuenta }, { where: { id_usuario: usuarioDB.id_usuario } });

        if (!activarUsuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No hubo actualización'
            });
        }

        res.json({
            ok: true,
            msg: 'Cuenta activada correctamente'
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
        
    }

}

const olvideContrasena = async (req, res = response) => {

    const { correo_electronico, usuario } = req.body;

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ attributes: ['id_usuario', 'usuario', 'correo_electronico', 'nombres', 'primer_apellido', 'segundo_apellido', 'curp', 'uuid', 'estado'], where: { correo_electronico, usuario } });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: `No se encontró información asociada a la cuenta de correo ${correo_electronico} y usuario ${usuario}. Hable con el administrador`
            });
        }

        const { id_usuario, nombres, primer_apellido, segundo_apellido, curp, uuid, estado } = usuarioDB;

        if(estado <= 0){
            return res.status(400).json({
                ok: true,
                msg: 'Primero debes confirmar tu cuenta para asegurar la recepción de correos. Abre el enlace que llegó a tu correo el día de tu registro',
                cuenta_activa: false
            });
        }

        const token_mail = await generarJWTregistro(id_usuario, correo_electronico);

        const fecha_token = dbConnection.literal('GETDATE()');

        const dataUpdate = { actualiza_contrasena: 0, token_mail, fecha_token };

        const updTokenMail = await Usuario.update( dataUpdate, { where: { id_usuario } });

        if (!updTokenMail) {
            return res.status(403).send({
                ok: false,
                msg: `no se encontró información del usuario con id ${id_usuario}`
            });
        }

        const nombre_completo = `${nombres.toUpperCase()} ${primer_apellido.toUpperCase()} ${segundo_apellido.toUpperCase()}`;

        
        const sendMailContrasena = await recuperarContrasenaMail(id_usuario, correo_electronico, nombre_completo, curp, uuid, token_mail, usuario);

        console.log(sendMailContrasena);

        const {ok, msg} = sendMailContrasena;

        if(!ok){
            return res.status(503).send({
                ok: false,
                msg
            });
        }

        res.send({
            ok: true,
            // usuarioDB
            msg: 'Hemos enviado instrucciones a su correo electrónico'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        })
    }

}

const obtenerInfoTokenMail = async (req, res = response) => {

    const { token_mail } = req.params;

    if (!token_mail) {
        return res.status(500).send({
            ok: false,
            msg: 'No se recibieron los atributos necesarios'
        });
    }

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ attributes: [ 'id_usuario', 'correo_electronico' ], where: { token_mail, actualiza_contrasena: 0 } });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El token es incorrecto, favor de validar'
            });
        }

        /* const fecha_activa_cuenta = dbConnection.literal('GETDATE()');
        const activarUsuarioDB = await Usuario.update({ estado: 1, fecha_activa_cuenta }, { where: { id_usuario: usuarioDB.id_usuario } });

        if (!activarUsuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No hubo actualización'
            });
        } */

        res.json({
            ok: true,
            msg: 'Información recuperada exitosamente',
            usuarioDB
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
        
    }

}

const reestablecercontrasena = async (req, res = response) => {

    const data = req.body;

    console.log(data);

    const { id_usuario, correo_electronico, contrasena, token_mail } = data;

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ where: { id_usuario, token_mail } });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El correo electrónico o el token son incorrectos, favor de validar'
            });
        }

        const fecha_actualiza_contrasena = dbConnection.literal('GETDATE()');
        const salt = bcrypt.genSaltSync();
        const newData = { fecha_actualiza_contrasena, actualiza_contrasena: 1 };

        newData.contrasena = bcrypt.hashSync(contrasena, salt);

        const actualizarContrasenaUsuarioDB = await Usuario.update( newData , { where: { id_usuario, correo_electronico, token_mail } });

        if (!actualizarContrasenaUsuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'La actualización de contraseña falló, algpun parámetro fue manipulado'
            });
        }

        res.json({
            ok: true,
            msg: 'Cuenta activada correctamente'
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
    login,
    renewToken,
    activarCuenta,
    olvideContrasena,
    obtenerInfoTokenMail,
    reestablecercontrasena
}