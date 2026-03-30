const { DataTypes } = require("sequelize");
const { dbConnection } = require("../database/config");

const Comites = dbConnection.define('comites', {
    id_comite: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    nombre_comite : { type: DataTypes.STRING },
    cupo : { type: DataTypes.NUMBER },
    lugares_disponibles : { type: DataTypes.NUMBER },
    estado : { type: DataTypes.NUMBER },
    fecha_alta : { type: DataTypes.DATE },
    fecha_baja : { type: DataTypes.DATE },
    fecha_actualiza : { type: DataTypes.DATE },
    fecha_activa : { type: DataTypes.DATE },
    id_admin_alta : { type: DataTypes.NUMBER },
    id_admin_baja : { type: DataTypes.NUMBER },
    id_admin_actualiza : { type: DataTypes.NUMBER },
    id_admin_activa : { type: DataTypes.NUMBER }
}, {
    freezeTableName: true
});







module.exports = Comites;