const { DataTypes } = require("sequelize");
const { dbConnection } = require("../database/config");


const RespuestasCuestionariosUsuarios = dbConnection.define('respuesta_cuestionarios_usuarios', {
    id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true
    },
    id_pregunta: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    id_respuesta: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    otro_texto: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_hora_registro: {
        type: DataTypes.DATE,
        allowNull: false
    },
    usuario: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    id_cuestionario: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    calificacion: {
        type: DataTypes.NUMBER,
        allowNull: true
    }
});

module.exports = RespuestasCuestionariosUsuarios;