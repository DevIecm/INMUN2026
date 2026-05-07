const { DataTypes } = require("sequelize");
const { dbConnection } = require("../database/config");

const Preguntas = dbConnection.define('preguntas_cuestionarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    cuestionario: { type: DataTypes.NUMBER },
    pregunta: { type: DataTypes.TEXT }
}, {
    freezeTableName: true
});


module.exports = Preguntas;