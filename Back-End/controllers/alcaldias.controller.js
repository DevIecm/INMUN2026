const { response } = require("express");
const Alcaldias = require("../models/alcaldias");
// const Alcaldia = require("../models/alcaldias.model");

const obtenerAlcaldias = async (req, res = response) =>{

    let { id_alcaldia } = req.params;
    const attributes = ['id_alcaldia', 'distrito_cab', 'nombre_alcaldia'];

    let where = {};

    if(id_alcaldia){
        if((isNaN(id_alcaldia) || Number(id_alcaldia) < 1 && Number(id_alcaldia) > 17)){
            return res.status(401).json({
                ok: false,
                msg: 'No se recibió un parámetro válido'
            });
        }

        where = { id_alcaldia };
    }
    where.status = 1;
    
    try {

        const alcaldiaDB = await Alcaldias.findAll( { attributes, where, order: [['nombre_alcaldia', 'ASC']] } );

        if(alcaldiaDB.length === 0){
            return res.status(401).send({ ok: false, msg: `No se encontró información relacionada con el id_alcaldia ${id_alcaldia}` })
        }

        res.send({
            ok: true,
            alcaldiaDB
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
    obtenerAlcaldias,
}