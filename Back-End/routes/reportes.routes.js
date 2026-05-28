/**
 * Ruta: '/api/admin-reportes'
 */

const { Router } = require('express');
const { validarAdminJWT } = require('../middlewares/admin-validar-jwt');
const { rptRegistros, descargarReporte, generaJustificantes, generaReporteEvaluaciones } = require('../controllers/reportes.controller');

const router = Router();

router.get('/rpt-registros', [validarAdminJWT], rptRegistros);

router.get('/justificantes', [validarAdminJWT], generaJustificantes);

router.get('/evaluaciones', [validarAdminJWT], generaReporteEvaluaciones);

// SÓLO DESCARGA EL ARCHIVO CREADO
router.get('/descargar-reporte/:nombre_reporte', descargarReporte);



module.exports = router;