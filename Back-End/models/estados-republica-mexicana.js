const { Sequelize } = require('sequelize');
const { DataTypes } = Sequelize;

const { dbConnection } = require('../database/config');

// Definimos el esquema
const EstadosRepublica = dbConnection.define('cat_estados_republica', {
    id_estado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.BOOLEAN,
    },
    fecha_alta: {
        type: DataTypes.STRING
    },
    fecha_baja: {
        type: DataTypes.STRING
    },
    fecha_actualiza: {
        type: DataTypes.STRING
    },
}, {
    freezeTableName: true
});


module.exports = EstadosRepublica;