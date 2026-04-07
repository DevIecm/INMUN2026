const { response } = require("express");

const { dbConnection } = require('../database/config');
const Asistencias = require("../models/asistencias.model");

const Comites = require("../models/comites.model");
const FechasComites = require("../models/fechas-comites.model");
const Usuario = require("../models/usuarios.model");

const crearComite = async (req, res = response) => {

    const data = req.body;
    const id_admin = req.id_admin;
    data.id_admin_alta = id_admin;
    data.lugares_disponibles = data.cupo;

    // Desestructuramos fecha de data para recorrer el arreglo y realizar insert en fechas
    const { fecha: fechas } = data;

    // console.log(data);
    
    try {

        const insComiteDB = await Comites.create( data );

        if (!insComiteDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        const { id_comite } = insComiteDB;

        // Guardar fechas
        // console.log({fecha});
        let insertados = 0;
        await fechas.forEach((fecha, i) => {
            insertados++;
            // console.log({fecha});
            let dataFecha = { id_comite, fecha: new Date(fecha).toISOString().slice(0, 10), id_admin_alta: id_admin };
            // console.log(id_comite);
            const insFechaDB = FechasComites.create( dataFecha );

            if(!insFechaDB){
                return res.status(501).send({
                    ok: false,
                    msg: `Ocurrió un error al guardar las fechas en el índice ${i}`
                });
            }
        });

        res.json({
            ok: true,
            msg: 'El comité se creó correctamente',
            insComiteDB,
            insertados
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
        
    }

}

const actualizarComite = async (req, res = response) => {

    const data = req.body;
    const id_admin = req.id_admin;
    data.id_admin_actualiza = id_admin;

    const { id_comite } = req.params;
    // TODO: Calcular lugares disponibles
    // data.lugares_disponibles = data.cupo;
    
    // Desestructuramos fecha de data para recorrer el arreglo y realizar insert en fechas
    const { fecha: fechas } = data;
    
    // console.log(data);
    
    try {
        const fecha_actualiza = dbConnection.literal('GETDATE()');
        data.fecha_actualiza = fecha_actualiza;

        const updComiteDB = await Comites.update( data, { where: { id_comite } } );

        if (!updComiteDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        // Pasar fechas registradas a estado 2 = Actualiza registro de comité y mejor las dejamos en estado 2 e insertamos nuevas fechas
        const updFechasBajaDB = await FechasComites.update( { estado: 2, fecha_actualiza, id_admin_actualiza: id_admin }, { where: { id_comite } } );

        if (!updFechasBajaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        // Guardar fechas
        let insertados = 0;
        await fechas.forEach((fecha, i) => {
            insertados++;
            // console.log({fecha});
            let dataFecha = { id_comite, fecha: new Date(fecha).toISOString().slice(0, 10), id_admin_alta: id_admin };
            // console.log(id_comite);
            const insFechaDB = FechasComites.create( dataFecha );

            if(!insFechaDB){
                return res.status(501).send({
                    ok: false,
                    msg: `Ocurrió un error al guardar las fechas en el índice ${i}`
                });
            }
        });

        res.json({
            ok: true,
            msg: 'El comité se actualizó correctamente',
            updComiteDB,
            insertados
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
        
    }

}

const activarComite = async (req, res = response) => {

    const { id_comite } = req.params;
    const id_admin_activa = req.id_admin;
    const fecha_activa = dbConnection.literal('GETDATE()');;


    // console.log(data);
    
    try {

        const updActivaComiteDB = await Comites.update({ estado: 1, fecha_activa, id_admin_activa }, { where: { id_comite } });

        if (!updActivaComiteDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        res.json({
            ok: true,
            msg: 'El comité se activó correctamente',
            updActivaComiteDB
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
        
    }

}

const obtenerTodosComites = async (req, res = response) => {

    
    try {

        const getComitesDB = await Comites.findAll( { attributes: [ 'id_comite', 'nombre_comite', 'cupo', 'lugares_disponibles', 'estado' ], order: [['id_comite', 'DESC']]} );

        if (!getComitesDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        res.json({
            ok: true,
            msg: 'Comites listados correctamente',
            getComitesDB
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
        
    }

}

const obtenerComitesActivos = async (req, res = response) => {

    
    try {

        const getComitesActivosDB = await Comites.findAll( { attributes: [ 'id_comite', 'nombre_comite', 'cupo', 'lugares_disponibles', 'estado' ], where: { estado : 1 }} );

        if (!getComitesActivosDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        res.json({
            ok: true,
            msg: 'Comites activos listados correctamente',
            getComitesActivosDB
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
        
    }

}

const obtenerComiteAEditar = async (req, res = response) => {

    const { id_comite } = req.params;

    
    try {

        let getComitesEditarDB = await Comites.findOne( { attributes: [ 'id_comite', 'nombre_comite', 'cupo', 'lugares_disponibles', 'estado' ], where: { id_comite }} );

        if (!getComitesEditarDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[16]'
            });
        }

        const getFechasComiteDB = await FechasComites.findAll({ attributes: ['fecha'], where: { id_comite, estado: 1 } });
        // const getFechasComiteDB = (await FechasComites.findAll( { attributes: [ 'fecha' ], where: { id_comite } } )).map(el => el.get({ plain: true }))
    
        if (!getFechasComiteDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[17]'
            });
        }

        const fecha = [];
        getFechasComiteDB.forEach((ele) => {
            fecha.push(ele.fecha);
        });

        res.json({
            ok: true,
            msg: 'Comité a editar listado correctamente',
            getComitesEditarDB,
            fecha
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[18]'
        });
        
    }

}

const reasignarComite = async (req, res = response) => {

    let { id_comite, id_usuario } = req.params;
    console.log(req.params);
    id_comite= Number(id_comite);
    id_usuario= Number(id_usuario);
    console.log({id_comite, id_usuario});

    // const validarCupo = await Comites.findOne({where: {id_comite}, attributes: ['id_comite', 'lugares_disponibles']});
    // // console.log(validarCupo.lugares_disponibles);

    // if(validarCupo.lugares_disponibles <= 0){
    //     return res.status(403).send({
    //         ok: false,
    //         msg: 'El comité seleccionado ya no cuenta con lugares disponibles'
    //     });
    // }

    const updComiteSeleccionadoBD = await Usuario.update( { id_comite }, { where: { id_usuario } } );
    if(!updComiteSeleccionadoBD){
        return res.status(501).send({
            ok: false,
            msg: 'No se pudo actualizar el comité, hable con el administrador',
            id_comite,
            id_usuario
        });
    }

    res.send({
        ok: true,
        msg: 'La reasignación del comité se guardó correctamente',
        // id_comite,
        // id_ciudadano
    })

    
    /* try {

        let getComitesEditarDB = await Comites.findOne( { attributes: [ 'id_comite', 'nombre_comite', 'cupo', 'lugares_disponibles', 'estado' ], where: { id_comite }} );

        if (!getComitesEditarDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[16]'
            });
        }

        const getFechasComiteDB = await FechasComites.findAll({ attributes: ['fecha'], where: { id_comite, estado: 1 } });
        // const getFechasComiteDB = (await FechasComites.findAll( { attributes: [ 'fecha' ], where: { id_comite } } )).map(el => el.get({ plain: true }))
    
        if (!getFechasComiteDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[17]'
            });
        }

        const fecha = [];
        getFechasComiteDB.forEach((ele) => {
            fecha.push(ele.fecha);
        });

        res.json({
            ok: true,
            msg: 'Comité a editar listado correctamente',
            getComitesEditarDB,
            fecha
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[18]'
        });
        
    } */

}

const eliminarComite = async (req, res = response) => {

    let { id_comite } = req.params;
    id_comite= Number(id_comite);
    console.log({id_comite});

    const id_admin = req.id_admin

    try {
        
        const validarCupo = await Comites.findOne({where: {id_comite}, attributes: ['id_comite', 'lugares_disponibles']});
        // console.log(validarCupo.lugares_disponibles);
    
        if(validarCupo.lugares_disponibles <= 0){
            return res.status(403).send({
                ok: false,
                msg: 'El comité seleccionado ya no cuenta con lugares disponibles'
            });
        }
    
        const fecha_baja = dbConnection.literal('GETDATE()');

        const updEliminarComiteBD = await Comites.update( { estado: 2, fecha_baja, id_admin_baja: id_admin }, { where: { id_comite } } );
        if(!updEliminarComiteBD){
            return res.status(501).send({
                ok: false,
                msg: 'No se pudo eliminar el comité, hable con el administrador',
                id_comite
            });
        }

        const updEliminarFEchasComiteBD = await FechasComites.update( { estado: 2, fecha_baja, id_admin_baja: id_admin }, { where: { id_comite, estado: 1 } } );
        if(!updEliminarFEchasComiteBD){
            return res.status(501).send({
                ok: false,
                msg: 'No se pudo eliminar el comité, hable con el administrador',
                id_comite
            });
        }
    
        res.send({
            ok: true,
            msg: 'El comité se eliminó correctamente'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
    }

}

const obtenerComiteSeleccionadoPorID = async (req, res = response) => {

    const { id_comite } = req.params;

    console.log(id_comite);

    
    try {

        const getComitesPorIDDB = await Comites.findOne( { attributes: [ 'id_comite', 'nombre_comite', 'cupo', 'lugares_disponibles' ], where: { estado : 1, id_comite }} );

        if (!getComitesPorIDDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        res.json({
            ok: true,
            msg: 'Comité seleccionado por usuario listado correctamente',
            getComitesPorIDDB
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
        
    }

}

const obtenerFechasComitePorID = async (req, res = response) => {

    const id_comite = req.params.id_comite;

    const fechasDB = await FechasComites.findAll( { where: { id_comite } } );

    res.send({
        ok: true,
        msg: 'Obtener fechas prueba',
        fechasDB
    });
}

const obtenerUsuariosYComites = async (req, res = response) => {
    const getUsuariosYComites = `SELECT id_usuario, CONCAT(nombres, ' ', primer_apellido, ' ', segundo_apellido) AS nombre_completo, usr.estado AS estado_usuario, usr.id_comite, com.nombre_comite FROM usuarios AS usr INNER JOIN comites AS com ON (usr.id_comite = com.id_comite) WHERE usr.estado = 4`;

    const exe_query_usuarios_y_comites = await dbConnection.query(getUsuariosYComites);
    if (!exe_query_usuarios_y_comites) {
        return res.status(401).json({
            ok: false,
            msg: 'Ocurrió un error en la consulta'
        });
    }

    console.log(exe_query_usuarios_y_comites);


    res.send({
        ok: true,
        listadoReasignacion: exe_query_usuarios_y_comites[0],
        total: exe_query_usuarios_y_comites[1]
    });
}

const obtenerValidacionListado = async (req, res = response) => {
    /* const getListadoValidacion = `SELECT * FROM vst_relacion_usuario_asistencia;`;

    const exe_query_ListadoValidacion = await dbConnection.query(getListadoValidacion);
    if (!exe_query_ListadoValidacion) {
        return res.status(401).json({
            ok: false,
            msg: 'Ocurrió un error en la consulta'
        });
    }

    console.log(exe_query_ListadoValidacion); */

    const usuariosConAsistenciaDB = await dbConnection.query(`SELECT id_usuario, nombres, primer_apellido, segundo_apellido, usr.id_comite, com.nombre_comite FROM usuarios AS usr INNER JOIN comites AS com ON (usr.id_comite = com.id_comite) WHERE usr.estado = 5`);

    if(!usuariosConAsistenciaDB){
        return res.status(401).json({
            ok: false,
            msg: 'Ocurrió un error en la consulta'
        });
    }

    // const id_usuarios = [];
    /* usuariosConAsistenciaDB[0].forEach( (element1, i) => {
        // console.log(element1);
        // id_usuarios.push(element1.id_usuario);
        usuariosConAsistenciaDB[0][i].asistencias = [];
    }); */
    // console.log(usuariosConAsistenciaDB[0]);

    const exe_query_asistencias = await dbConnection.query(`SELECT fec.id_fecha, fecha, asis.id_usuario, adm.nombre_usuario FROM asistencias AS asis INNER JOIN fechas_comites AS fec ON (asis.id_fecha = fec.id_fecha) INNER JOIN admin AS adm ON (adm.id_admin = asis.id_admin_alta) WHERE asis.estado = 1`);
    if(exe_query_asistencias){
        exe_query_asistencias[0].forEach( (ele, i2) => {
            // console.log(ele);
            var found2 = usuariosConAsistenciaDB[0].find(e => e.id_usuario === ele.id_usuario);
            if(found2){
                // console.log(found2);
                if(!found2.asistencias){
                    found2.asistencias = [];
                }
                found2.asistencias.push(ele);
                // console.log(found2);
            }
        })
    }

    // console.log(exe_query_asistencias[0]);  


    res.send({
        ok: true,
        usuariosConAsistenciaDB: usuariosConAsistenciaDB[0]
    });
}

const obtenerLugaresDisponibles = async (req, res = response) => {

    let { id_comite } = req.params;
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

        const percentDisponible = (lugares_disponibles/cupo)*100;

        res.send({
            ok: true,
            msg: 'Obtener lugares disponibles!',
            data: {
                lugares_disponibles,
                cupo,
                percentDisponible
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
    }

    // console.log(exe_query_ListadoValidacion);


}

module.exports = {
    crearComite,
    actualizarComite,
    obtenerComitesActivos,
    obtenerComiteSeleccionadoPorID,
    activarComite,
    obtenerFechasComitePorID,
    obtenerTodosComites,
    obtenerComiteAEditar,
    obtenerUsuariosYComites,
    obtenerValidacionListado,
    reasignarComite,
    obtenerLugaresDisponibles,
    eliminarComite
}