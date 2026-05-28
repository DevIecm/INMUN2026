const { Router } = require("express");
const { getPreguntasGenerales, getRespuestasGenerales, getPreguntas, getRespuestas, guardarRespuestas, obtenerCalificacion } = require("../controllers/cuestionarios.controller");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.get('/obtener-preguntas-generales', getPreguntasGenerales);
router.get('/obtener-respuestas-generales', getRespuestasGenerales);
router.get('/obtener-preguntas', getPreguntas);

router.post('/guardar-respuestas-modulo', validarJWT, guardarRespuestas);

router.get('/obtener-respuestas', getRespuestas);
router.post('/guardar-respuestas', guardarRespuestas);
router.get('/obtener-calificacion', obtenerCalificacion);

module.exports = router;    