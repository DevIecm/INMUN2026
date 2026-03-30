/**
 * Ruta: '/api/comite'
 */

const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");

const { validarAdminJWT } = require("../middlewares/admin-validar-jwt");
const { crearComite, obtenerComiteSeleccionadoPorID, activarComite, obtenerFechasComitePorID, obtenerComitesActivos, obtenerTodosComites, obtenerComiteAEditar, actualizarComite, obtenerUsuariosYComites, obtenerValidacionListado, reasignarComite, obtenerLugaresDisponibles, eliminarComite } = require("../controllers/comite.controller");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();



router.post('/crear-comite', [
    validarAdminJWT,
    check('nombre_comite', 'El nombre del comité es obligatorio').not().isEmpty(),
    check('cupo', 'El cupo es obligatorio').not().isEmpty(),
    check('fecha', 'El cupo es obligatorio').not().isEmpty(),
    validarCampos
], crearComite);

router.put('/actualizar-comite/:id_comite', [
    validarAdminJWT,
    check('nombre_comite', 'El nombre del comité es obligatorio').not().isEmpty(),
    check('cupo', 'El cupo es obligatorio').not().isEmpty(),
    check('fecha', 'El cupo es obligatorio').not().isEmpty(),
    validarCampos
], actualizarComite);

router.put('/activar-comite/:id_comite', [
    validarAdminJWT
], activarComite);

router.get('/obtener-comites-activos', obtenerComitesActivos);

router.get('/obtener-todos-comites', [ validarAdminJWT ], obtenerTodosComites);

router.get('/obtener-comite-editar/:id_comite', [ validarAdminJWT ], obtenerComiteAEditar);

router.put('/actualizar-comite-seleccionado/:id_comite/:id_usuario', [ validarAdminJWT ], reasignarComite);

router.delete('/eliminar-comite/:id_comite', [validarAdminJWT], eliminarComite);

// Ciudadano
router.get('/obtener-comite-seleccionado-por-usuario/:id_comite', [
    validarJWT
], obtenerComiteSeleccionadoPorID);

router.get('/obtener-usuarios-y-comite', [
    validarAdminJWT
], obtenerUsuariosYComites);

router.get('/obtener-listado-validacion', [
    validarAdminJWT
], obtenerValidacionListado);

router.get('/obtener-lugares-disponibles/:id_comite', [
    validarJWT
], obtenerLugaresDisponibles);


router.get('/obtener-fecha-comite/:id_comite', [
    validarJWT
], obtenerFechasComitePorID);


module.exports = router;