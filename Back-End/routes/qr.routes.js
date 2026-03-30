/**
 * Ruta: '/api/code-qr'
 */

const { Router } = require('express');
const { obtenerQr, registrarAsistencia, eliminarAsistencia } = require('../controllers/qr.controller');
const { validarAdminJWT } = require('../middlewares/admin-validar-jwt');

const router = Router();

router.get('/download/:id_usuario/:uuid', obtenerQr);

router.post('/:uuid',[
    validarAdminJWT
], registrarAsistencia);

router.put('/:uuid',[
    validarAdminJWT
], eliminarAsistencia);

module.exports = router;