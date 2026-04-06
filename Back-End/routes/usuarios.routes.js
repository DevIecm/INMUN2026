/**
 * Ruta: '/api/usuarios'
 */

const { Router } = require("express");
const { check, body  } = require("express-validator");
const expressFileUpload = require('express-fileupload');

const { 
    crearUsuario, 
    eliminarUsuario, 
    complementarInformacion, 
    getUsuarioById, 
    suscribirAComite, 
    permisosYAutorizaciones, 
    getPermisoId, 
    avanceRegistro, 
    eliminarCuentaUsuario, 
    obtenerListaUsuariosValidacion, 
    validarRegistroPorUsuario,
    enviarConstanciaUsuario
 } = require("../controllers/usuarios.controller");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarAdminJWT } = require("../middlewares/admin-validar-jwt");

const router = Router();

router.use( expressFileUpload() );


router.post('/', [
    // Validación de campos obligatorios
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('primer_apellido', 'El primer apellido es obligatorio').not().isEmpty(),
    check('segundo_apellido', 'El segundo apellido es obligatorio').not().isEmpty(),
    check('fecha_nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    check('edad', 'La edad es obligatoria').not().isEmpty(),
    check('usuario', 'El usuario es obligatorio').not().isEmpty(),
    check('correo_electronico', 'El correo electrónico es obligatorio').not().isEmpty(),
    check('correo_electronico', 'El formato del correo electrónico no es válido').isEmail(),
    check('contrasena', 'La contraseña es obligatoria').not().isEmpty(),
    check('curp', 'La curp es obligatoria').not().isEmpty(),
    validarCampos
], crearUsuario);

router.delete('/eliminar-usuario/:id_usuario', [
    validarAdminJWT,
], eliminarUsuario);

router.put('/complementa-informacion', [
    validarJWT,
    check('telefono_celular', 'El teléfono celular es obligatorio').not().isEmpty(),
    check('telefono_casa', 'El teléfono de casa es obligatorio').not().isEmpty(),
    check('demarcacion_territorial', 'La demarcación es obligatoria').not().isEmpty(),
    check('como_te_enteraste', 'El cómo te enteraste es obligatorio').not().isEmpty(),
    validarCampos
], complementarInformacion);

router.post('/permisos-autorizaciones', [
    validarJWT,
    check('conoce_acepta_terminos_convocatoria', 'El teléfono celular es obligatorio').not().isEmpty(),
    check('ha_leido_aviso_privacidad', 'El teléfono de casa es obligatorio').not().isEmpty(),
    check('autoriza_uso_imagen', 'La demarcación es obligatoria').not().isEmpty(),
    validarCampos
], permisosYAutorizaciones);

router.post('/enviar-constancia', [
    validarJWT,
], enviarConstanciaUsuario);

router.post('/permisos-autorizaciones-menor', [
    validarJWT,
    check('conoce_acepta_terminos_convocatoria', 'El teléfono celular es obligatorio').not().isEmpty(),
    check('ha_leido_aviso_privacidad', 'El teléfono de casa es obligatorio').not().isEmpty(),
    check('nombre_tutor', 'Debes ingresar el nombre del tutor').not().isEmpty(),
    check('curp_tutor', 'Debes ingresar la clave de elector del tutor').not().isEmpty(),
    check('parentesco', 'Debes seleccionar el parentesco').not().isEmpty(),
    // FIX: Se quita menor_edad y se agrega autoriza_uso_imagen
    check('autoriza_uso_imagen', 'La demarcación es obligatoria').not().isEmpty(),
    // check('menor_edad', 'Debes seleccionar si es menor de edad o no').not().isEmpty(),
    validarCampos
], permisosYAutorizaciones);

router.get('/validacion-usuarios', [
    validarAdminJWT,
], obtenerListaUsuariosValidacion);

router.put('/validar-usuario/:id_usuario', [
    validarAdminJWT,
], validarRegistroPorUsuario);

router.get('/permisos-autorizaciones', [
    validarJWT,
    validarCampos
], getPermisoId);

router.get('/info-user/:id_usuario', validarJWT, getUsuarioById);

router.get('/avance-registro', validarJWT, avanceRegistro);

router.post('/comite', [
    validarJWT,
    check('id_comite', 'Seleccione el comité al que esea inscribirse').not().isEmpty(),
    validarCampos
], suscribirAComite);

router.delete('/eliminar-cuenta-usuario/:id_comite/:id_usuario', [validarAdminJWT], eliminarCuentaUsuario);

module.exports = router;