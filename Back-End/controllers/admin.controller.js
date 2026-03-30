const { response } = require("express");
const bcrypt = require('bcrypt');

const Admin = require('../models/admin.model');

const crearAdmin = async (req, res = response) => {

    const data = req.body;
    
    const { contrasena } = data;

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    data.contrasena = bcrypt.hashSync(contrasena, salt);

    try {

        // Verificar email
        const insAdminDB = await Admin.create( data );

        if (!insAdminDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        res.json({
            ok: true,
            msg: 'El usuario se creó correctamente',
            insAdminDB
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
    crearAdmin
}