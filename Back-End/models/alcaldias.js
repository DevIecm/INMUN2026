const { Sequelize } = require('sequelize');
const { DataTypes } = Sequelize;

const { dbConnection } = require('../database/config');

// Definimos el esquema
const Alcaldias = dbConnection.define('cat_alcaldias', {
    id_alcaldia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    distrito_cab: {
        type: DataTypes.NUMBER
    },
    nombre_alcaldia: {
        type: DataTypes.STRING
    },
    fecha_alta: {
        type: DataTypes.STRING
    },
    fecha_modif: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.NUMBER
    },
}, {
    freezeTableName: true
});


module.exports = Alcaldias;