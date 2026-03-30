const { DataTypes } = require("sequelize");
const { dbConnection } = require("../database/config");

const Asistencias = dbConnection.define('asistencias', {
    id_asistencia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    id_usuario: { type: DataTypes.NUMBER },
    id_fecha: { type: DataTypes.NUMBER },
    estado: { type: DataTypes.BOOLEAN },
    fecha_alta: { type: DataTypes.DATE },
    fecha_baja: { type: DataTypes.DATE },
    fecha_actualiza: { type: DataTypes.DATE },
    id_admin_alta: { type: DataTypes.NUMBER },
    id_admin_baja: { type: DataTypes.NUMBER },
    id_admin_actualiza: { type: DataTypes.NUMBER },
    id_comite: { type: DataTypes.NUMBER }
}, {
    freezeTableName: true
});






module.exports = Asistencias;