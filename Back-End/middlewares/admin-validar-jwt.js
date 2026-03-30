const { response } = require("express");
const jwt = require('jsonwebtoken');


const validarAdminJWT = (req, res=response, next)=>{

    console.log('Valida ADMIN JWT');

    // Leer el token
    const token = req.header('x-token-admin');

    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { id_admin, nombre_usuario, perfil } = jwt.verify( token, process.env.JWT_SECRET );

        req.id_admin = id_admin;
        req.nombre_usuario = nombre_usuario;
        req.perfil = perfil;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token incorrecto'
        });
    }

}


module.exports = {
    validarAdminJWT
}