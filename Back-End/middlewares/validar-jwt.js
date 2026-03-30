const { response } = require("express");
const jwt = require('jsonwebtoken');


const validarJWT = (req, res=response, next)=>{

    console.log('Valida JWT');

    // Leer el token
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { id_usuario, clave_elector } = jwt.verify( token, process.env.JWT_SECRET );

        req.id_usuario = id_usuario;
        req.clave_elector = clave_elector;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token incorrecto'
        });
    }

}

const validarJWTregistro = (req, res=response, next)=>{

    console.log('Valida JWT del registro');

    // Leer el token
    // const token = req.header('x-token');
    const { token_mail } = req.params;
    // console.log(token_mail);

    if(!token_mail){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { id_usuario } = jwt.verify( token_mail, process.env.JWT_SECRET_REGISTER );

        console.log(id_usuario);

        // req.id_usuario = id_usuario;

        next();
    } catch (error) {
        console.log(error);
        // TODO: Pasar el registro a estado 0 para indicar que debe volver a registrarse
        return res.status(401).json({
            ok: false,
            msg: 'El token ha expirado'
        });
    }

}


module.exports = {
    validarJWT,
    validarJWTregistro
}