const { response } = require("express");
const EstadosRepublica = require("../models/estados-republica-mexicana");

const obtenerEstadosRepublica = async (req, res = response) =>{

    let { id_estado } = req.params;
    const attributes = ['id_estado', 'nombre', 'estado'];

    let where = {};

    if(id_estado){
        if((isNaN(id_estado) || Number(id_estado) < 1 && Number(id_estado) > 17)){
            return res.status(401).json({
                ok: false,
                msg: 'No se recibió un parámetro válido'
            });
        }

        where = { id_estado };
    }
    where.estado = 1;
    
    try {

        const edosDB = await EstadosRepublica.findAll( { attributes, where, order: [['nombre', 'ASC']] } );

        if(edosDB.length === 0){
            return res.status(401).send({ ok: false, msg: `No se encontró información relacionada con el id_estado ${id_estado}` })
        }

        res.send({
            ok: true,
            edosDB
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = {
    obtenerEstadosRepublica,
}