/**
 * Ruta: '/api/constancias'
 */

const { Router } = require('express');

const { validarAdminJWT } = require('../middlewares/admin-validar-jwt');
const { testConstanciasPost, generarConstancias, enviarConstancias, obtenerConstancia } = require('../controllers/constancias.controller');

const router = Router();

router.get('/download/:id_usuario/:uuid', obtenerConstancia);

router.post('/generar-constancias',[
    validarAdminJWT
], generarConstancias);

router.post('/enviar-constancias',[
    validarAdminJWT
], enviarConstancias);

// router.get('/download/:id_usuario/:uuid', obtenerConstancia);

module.exports = router;