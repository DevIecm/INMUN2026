const { response } = require("express");
const bcrypt = require("bcrypt");


const { dbConnection } = require("../database/config");

const Admin = require("../models/admin.model");
const { generarAdminJWT } = require("../helpers/admin-jwt");
const { getMenuAdminFrontEnd } = require("../helpers/menu-frontend");


const loginAdmin = async (req, res = response) => {

    const { usuario, contrasena } = req.body;

    try {

        // Verificar email
        const adminDB = await Admin.findOne({ where: { usuario } });

        console.log(adminDB)

        if (!adminDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Correo o contraseña incorrecta [correo]'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( contrasena, adminDB.contrasena );

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Correo o contraseña incorrecta [contraseña]'
            });
        }

        if (adminDB.estado === 0) {
            return res.status(400).json({
                ok: true,
                msg: 'La cuenta no se encuentra activa',
            });
        }

        // Generar el TOKEN - JWT
        const token = await generarAdminJWT(adminDB.id_admin, adminDB.nombre_usuario, adminDB.perfil );

        // TODO: Regresar el menú

        res.json({
            ok: true,
            token,
            menu: getMenuAdminFrontEnd(adminDB.perfil, adminDB.nombre_usuario)

        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        })
    }

}

const renewTokenAdmin = async (req, res = response) => {
    const { id_admin, nombre_usuario, perfil } = req;
    // Generar el TOKEN - JWT
    const token = await generarAdminJWT( id_admin, nombre_usuario, perfil );

    // Obtener el admin por id
    const adminDB = await Admin.findOne({ where: { id_admin } });
    // const adminDB =  await Usuario.findOne({ where: {correo_electronico}});

    if (!adminDB) {
        return res.status(401).json({
            ok: false,
            msg: `No sencontró un usuario con el id ${id_admin}`
        });
    }

    res.json({
        ok: true,
        token,
        adminDB,
        menu: getMenuAdminFrontEnd(adminDB.perfil, adminDB.nombre_usuario)
    });
}


module.exports = {
    loginAdmin,
    renewTokenAdmin
}