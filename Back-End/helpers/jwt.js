const jwt = require('jsonwebtoken');

const generarJWT = ( id_usuario ) =>{

    return new Promise( (resolve, reject) =>{

        const payload = { id_usuario };
    
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '15m'
        }, (err, token) =>{
            if(err){
                console.log(err);
                reject('No se pudo generar el JWT');
            } else{
                resolve(token);
            }
        });

    });


}

module.exports = {
    generarJWT
};