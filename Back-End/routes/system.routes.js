/**
 * Ruta: '/api/estado-sistema'
 */

const { Router } = require("express");
const { obtenerEstadoSistema, cambiarEstadoSistema } = require("../controllers/system-inmun.controller");
const { validarAdminJWT } = require("../middlewares/admin-validar-jwt");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();


router.get('/',
    obtenerEstadoSistema
);

router.post('/',
    [
        validarAdminJWT,
        check('estado', 'El estado es obligatorio').not().isEmpty(),
        validarCampos
    ],
    cambiarEstadoSistema
);

module.exports = router;