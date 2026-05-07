const { DataTypes } = require("sequelize");
const { dbConnection } = require("../database/config");

const RespuestasCuestionarios = dbConnection.define('respuestas_cuestionarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    cuestionario: { type: DataTypes.NUMBER },
    pregunta: { type: DataTypes.NUMBER },
    respuesta: { type: DataTypes.TEXT },
    puntuacion: { type: DataTypes.NUMBER }
}, {
    freezeTableName: true
});

module.exports = RespuestasCuestionarios;