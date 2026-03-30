/**
 * Ruta: '/api/admin-login'
 */

const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { loginAdmin, renewTokenAdmin } = require("../controllers/admin-auth.controller");
const { validarAdminJWT } = require("../middlewares/admin-validar-jwt");

const router = Router();

router.post('/', [
    // Validación de campos obligatorios
    check('usuario', 'El usuario es obligatorio').not().isEmpty(),
    check('contrasena', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], loginAdmin);


router.get('/renew',
    validarAdminJWT,
    renewTokenAdmin
);


module.exports = router;