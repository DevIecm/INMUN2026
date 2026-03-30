/**
 * Ruta: '/api/estados-republica-mexicana'
 */

const { Router } = require("express");
const { obtenerEstadosRepublica } = require("../controllers/estados-republica-mexicana.controller");

const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get('/:id_estado?', [
    // validarJWT
], obtenerEstadosRepublica);

module.exports = router;