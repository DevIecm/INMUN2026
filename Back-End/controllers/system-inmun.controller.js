const { response } = require("express");
const bcrypt = require('bcrypt');
const SystemInmun = require("../models/system-inmun.model");
const { dbConnection } = require("../database/config");


const obtenerEstadoSistema = async (req, res = response) => {

    try {

        // Verificar email
        const getEstadoSistemaDB = await SystemInmun.findOne( {
            limit: 1,
            order: [['id_etapa', 'DESC']]
        });

        if (!getEstadoSistemaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        res.json({
            ok: true,
            getEstadoSistemaDB
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
        
    }

}

const cambiarEstadoSistema = async (req, res = response) => {

    const data = req.body;
    const id_admin = req.id_admin;
    data.id_admin_alta = id_admin;
    // console.log({id_admin});
    console.log({data});

    try {

        // OBtener el último registrado en la base de datos
        const getEstadoSistemaDB = await SystemInmun.findOne( {
            limit: 1,
            order: [['id_etapa', 'DESC']]
        });

        if (!getEstadoSistemaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }
        
        const fecha_cambia_estado = dbConnection.literal('GETDATE()');
        // console.log({fecha_cambia_estado});

        // Actualizar a estado 0 (baja), id_admin_cambia_estado, fecha_cambia_estado el registro obtenido
        const updEstadoSistemaObtenidoDB = await SystemInmun.update( { estado:0, fecha_cambia_estado, id_admin_cambia_estado:id_admin  }, { where: { id_etapa: getEstadoSistemaDB.id_etapa } } );

        if (!updEstadoSistemaObtenidoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        // Crear nuevo estado del sistema
        const crearNuevoEstadoSistemaDB = await SystemInmun.create( data );
        if (!crearNuevoEstadoSistemaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        res.json({
            ok: true,
            crearNuevoEstadoSistemaDB
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
    obtenerEstadoSistema,
    cambiarEstadoSistema
}