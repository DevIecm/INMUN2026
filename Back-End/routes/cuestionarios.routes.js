const { Router } = require("express");
const { getPreguntas, getRespuestas, guardarRespuestas } = require("../controllers/cuestionarios.controller");

const router = Router();

router.get('/obtener-preguntas', getPreguntas);
router.get('/obtener-respuestas', getRespuestas);
router.post('/guardar-respuestas', guardarRespuestas);

module.exports = router;