const jwt = require('jsonwebtoken');

const generarJWTregistro = ( id_usuario, correo_electronico ) => {
    return new Promise ( (resolve, reject) => {
        const payloadRegistro = { id_usuario, correo_electronico };
        console.log({payloadRegistro});

        jwt.sign( payloadRegistro, process.env.JWT_SECRET_REGISTER, {
            // expiresIn: '1m'
            expiresIn: '2h'
        }, (err, token) => {
            if(err){
                console.log(err);
                reject('No se pudo generar el JWT');
            } else{
                resolve( token );
            }
        })
    })
}

module.exports = {
    generarJWTregistro
}