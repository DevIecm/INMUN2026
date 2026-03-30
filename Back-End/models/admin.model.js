const { DataTypes } = require("sequelize");
const { dbConnection } = require("../database/config");

const Admin = dbConnection.define('admin', {
    id_admin: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    nombre_usuario: { type: DataTypes.STRING },
    usuario: { type: DataTypes.STRING },
    contrasena: { type: DataTypes.STRING },
    estado: { type: DataTypes.BOOLEAN },
    perfil: { type: DataTypes.NUMBER },
    fecha_alta: { type: DataTypes.DATE },
    fecha_baja: { type: DataTypes.DATE },
}, {
    freezeTableName: true
});





module.exports = Admin;