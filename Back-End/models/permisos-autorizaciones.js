const { Sequelize } = require('sequelize');
const { DataTypes } = Sequelize;

const { dbConnection } = require('../database/config');

// Definimos el esquema
const PermisosAutorizaciones = dbConnection.define('permisos_autorizaciones', {
    id_autorizacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        autoIncrementIdentity: true
    },
    conoce_acepta_terminos_convocatoria: {
        type: DataTypes.BOOLEAN
    },
    ha_leido_aviso_privacidad: {
        type: DataTypes.BOOLEAN
    },
    autoriza_uso_imagen: {
        type: DataTypes.BOOLEAN
    },
    nombre_tutor: {
        type: DataTypes.STRING
    },
    curp_tutor: {
        type: DataTypes.STRING
    },
    parentesco: {
        type: DataTypes.INTEGER
    },
    id_usuario: {
        type: DataTypes.INTEGER
    },
    fecha_alta: {
        type: DataTypes.DATE
    },
    menor_edad: {
        type: DataTypes.BOOLEAN
    }
}, {
    freezeTableName: true,
    hasTrigger: true
});



module.exports = PermisosAutorizaciones;