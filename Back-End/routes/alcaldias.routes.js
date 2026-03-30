/**
 * Ruta: '/api/alcaldias'
 */

const { Router } = require("express");
const { check  } = require("express-validator");
const { obtenerAlcaldias } = require("../controllers/alcaldias.controller");

const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get('/:id_alcaldia?', [
    // validarJWT
], obtenerAlcaldias);

module.exports = router;