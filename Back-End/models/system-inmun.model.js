const { DataTypes } = require("sequelize");
const { dbConnection } = require("../database/config");

const SystemInmun = dbConnection.define('sistema_inmun', {
    id_etapa: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    estado: { type: DataTypes.NUMBER },
    id_admin_alta: { type: DataTypes.INTEGER },
    id_admin_cambia_estado: { type: DataTypes.INTEGER },
    fecha_alta: { type: DataTypes.DATE },
    fecha_cambia_estado: { type: DataTypes.DATE },
}, {
    freezeTableName: true
});





module.exports = SystemInmun;