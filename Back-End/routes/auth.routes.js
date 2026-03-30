/**
 * Ruta: '/api/login'
 */

const { Router } = require("express");
const { validarCampos } = require("../middlewares/validar-campos");

const { login, renewToken, activarCuenta, olvideContrasena, obtenerInfoTokenMail, reestablecercontrasena } = require("../controllers/auth.controller");
const { check } = require("express-validator");
const { validarJWT, validarJWTregistro } = require("../middlewares/validar-jwt");
const { recuperarContrasenaMail } = require("../helpers/correos/correo-recuperacion-contrasena");

const router = Router();

router.post('/',
    [
        /* check('correo_electronico', 'El correo es obligatorio').not().isEmpty(),
        check('correo_electronico', 'El formato del correo electrónico no es válido').isEmail(), */
        check('usuario', 'La contraseña es obligatoria').not().isEmpty(),
        check('contrasena', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    login
);

router.put('/active/:correo_electronico/:token_mail/:uuid', [/* validarJWTregistro */], activarCuenta);

router.post('/olvide-contrasena',
    [
        check('correo_electronico', 'El correo es obligatorio').not().isEmpty(),
        check('correo_electronico', 'El formato del correo electrónico no es válido').isEmail(),
        check('usuario', 'El formato del correo electrónico no es válido').not().isEmpty(),
        validarCampos
    ],
    olvideContrasena
);

router.get('/obtener-info-de-token-mail/:token_mail',
    obtenerInfoTokenMail
);

router.put('/reestablecer-contrasena', reestablecercontrasena);

router.get('/renew',
    validarJWT,
    renewToken
);

module.exports = router;