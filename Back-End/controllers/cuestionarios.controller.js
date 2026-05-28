const { response } = require("express");
const { dbConnection } = require('../database/config');
const Preguntas = require('../models/cuestionarios.model');
const RespuestasCuestionarios = require('../models/cuestionarios_respuestas.model');
const RespuestasCuestionariosUsuarios = require('../models/respuestas_cuestionarios_usuarios');


const getPreguntasGenerales = async (req = request, res = response) => {
    try {
        const getPreguntasGeneralesDB = await Preguntas.findAll(
            {
                where:
                    { cuestionario: 4 },
                attributes: ['id', 'cuestionario', 'pregunta'],
                order: [['id', 'ASC']]
            });

        if (!getPreguntasGeneralesDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        res.json({
            ok: true,
            msg: 'Preguntas obtenidas correctamente',
            getPreguntasGeneralesDB
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
    }
}

const getRespuestasGenerales = async (req = request, res = response) => {
    try {
        const getRespuestasGeneralesDB = await RespuestasCuestionarios.findAll(
            {
                where:
                    { cuestionario: 4 },
                attributes: ['id', 'cuestionario', 'pregunta', 'respuesta', 'puntuacion'],
                order: [['id', 'ASC']]
            });

        if (!getRespuestasGeneralesDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }

        res.json({
            ok: true,
            msg: 'Respuestas obtenidas correctamente',
            getRespuestasGeneralesDB
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
    }
}

const getPreguntas = async (req = request, res = response) => {

    const nivel_escolar = req.query.nivel_escolar;

    try {

        const getPreguntasDB = await Preguntas.findAll(
            {
                where:
                    { nivel_escolar: nivel_escolar },
                attributes: ['id', 'cuestionario', 'pregunta', 'nivel_escolar'],
                order: [['id', 'ASC']]
            });

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
    const nivel_escolar = req.query.nivel_escolar;

    try {

        const getRespuestasDB = await RespuestasCuestionarios.findAll({
            where: { cuestionario: nivel_escolar },
            attributes: ['id', 'cuestionario', 'pregunta', 'respuesta', 'puntuacion'], order: [['id', 'ASC']]
        });

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

    const respuestas = req.body;
    console.log("respuestas: ", respuestas);
    // const id_usuario = req.id_usuario;

    // console.log('respuestas: ', respuestas);

    try {

        const data = respuestas.map(r => ({
            id_pregunta: r.id_pregunta,
            id_respuesta: r.id_respuesta,
            otro_texto: r.otro_texto || null,
            fecha_hora_registro: dbConnection.literal('GETDATE()'),
            usuario: r.usuario,
            id_cuestionario: r.id_cuestionario,
            calificacion: r.calificacion || 0
        }));

        const insRespuestasDB =
            await RespuestasCuestionariosUsuarios.bulkCreate(data);

        res.json({
            ok: true,
            msg: 'Respuestas guardadas correctamente',
            insRespuestasDB
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]',
            error
        });

    }
};

const obtenerCalificacion = async (req = request, res = response) => {

    const id_usuario = req.query.id_usuario;
    const id_cuestionario = req.query.id_cuestionario;

    try {

        const calificacionDB = await RespuestasCuestionariosUsuarios.findAll({
            where: { usuario: id_usuario, id_cuestionario: id_cuestionario },
            attributes: ['calificacion']
        });
    
        if (!calificacionDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hable con el administrador - CODE[N]'
            });
        }   
    
        res.json({
            ok: true,
            msg: 'Calificación obtenida correctamente',
            calificacionDB
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador - CODE[N]'
        });
    }
};


module.exports = {
    getPreguntasGenerales,
    getRespuestasGenerales,
    getPreguntas,
    obtenerCalificacion,

    getRespuestas,
    guardarRespuestas
}
