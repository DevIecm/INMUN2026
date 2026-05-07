const { response } = require("express");
const { dbConnection } = require('../database/config');
const Preguntas = require('../models/cuestionarios.model');
const RespuestasCuestionarios = require('../models/cuestionarios_respuestas.model');

const getPreguntas = async (req = request, res = response) => {

    const id_cuestionario = req.query.id_cuestionario;

    try {

        const getPreguntasDB = await Preguntas.findAll({ where: { cuestionario: id_cuestionario }, attributes: ['id', 'cuestionario', 'pregunta'], order: [['id', 'ASC']] });

        if (!getPreguntasDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        res.json({
            ok: true,
            msg: 'Preguntas obtenidas correctamente',
            getPreguntasDB
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
    }
}

const getRespuestas = async (req = request, res = response) => {
    const id_cuestionario = req.query.id_cuestionario;

    try {

        const getRespuestasDB = await RespuestasCuestionarios.findAll({ where: { cuestionario: id_cuestionario }, attributes: ['id', 'cuestionario', 'pregunta', 'respuesta', 'puntuacion'], order: [['id', 'ASC']] });

        if (!getRespuestasDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        res.json({
            ok: true,
            msg: 'Respuestas obtenidas correctamente',
            getRespuestasDB
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
    }
}

const guardarRespuestas = async (req = request, res = response) => {
    const data = req.body;
    const id_usuario = req.id_usuario;
    const fecha_alta = dbConnection.literal('GETDATE()');
    data.id_usuario = id_usuario;
    data.fecha_alta = fecha_alta;

    try {
        const insRespuestasDB = await respuestas_cuestionarios.create(data);

        if (!insRespuestasDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        res.json({
            ok: true,
            msg: 'Respuestas guardadas correctamente',
            insRespuestasDB
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
    }
}

module.exports = {
    getPreguntas,
    getRespuestas,
    guardarRespuestas
}
