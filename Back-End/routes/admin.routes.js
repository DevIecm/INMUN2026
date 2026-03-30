/**
 * Ruta: '/api/admin'
 */

const { Router } = require("express");
const { check } = require("express-validator");
const { crearAdmin } = require("../controllers/admin.controller");

const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();


router.post('/crear-admin',
    [
        check('nombre_usuario', 'El nombre del usuario es obligatorio').not().isEmpty(),
        check('usuario', 'El usuario es obligatorio').not().isEmpty(),
        check('contrasena', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    crearAdmin
);

module.exports = router;