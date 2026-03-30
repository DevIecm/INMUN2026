const { DataTypes } = require("sequelize");
const { dbConnection } = require("../database/config");

const UsuarioEliminado = dbConnection.define('usuarios_eliminados', {
    id_eliminado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        unique: true
    },
    nombres: {
        type: DataTypes.STRING
    },
    primer_apellido: {
        type: DataTypes.STRING
    },
    segundo_apellido: {
        type: DataTypes.STRING
    },
    fecha_nacimiento: {
        type: DataTypes.STRING
    },
    edad: { type: DataTypes.STRING },
    usuario: { type: DataTypes.STRING },
    correo_electronico: { type: DataTypes.STRING },
    curp: { type: DataTypes.STRING },
    contrasena: { type: DataTypes.STRING },
    uuid: { type: DataTypes.STRING },
    estado: { type: DataTypes.NUMBER },
    perfil: { type: DataTypes.NUMBER },
    genero: { type: DataTypes.NUMBER },
    telefono_celular: { type: DataTypes.STRING },
    telefono_casa: { type: DataTypes.STRING },
    demarcacion_territorial: { type: DataTypes.NUMBER },
    entidad_federativa: { type: DataTypes.NUMBER },
    como_te_enteraste: { type: DataTypes.NUMBER },
    id_comite: { type: DataTypes.NUMBER },
    folio: { type: DataTypes.STRING },
    fecha_selecciona_comite: { type: DataTypes.DATE },
    fecha_alta: { type: DataTypes.STRING },
    fecha_baja: { type: DataTypes.STRING },
    fecha_activa_cuenta: { type: DataTypes.DATE },
    actualiza_contrasena: { type: DataTypes.NUMBER },
    fecha_actualiza_contrasena: { type: DataTypes.DATE },
    token_mail: { type: DataTypes.STRING },
    fecha_token: { type: DataTypes.DATE },
    fecha_complementa_informacion: { type: DataTypes.DATE },
    discapacidad: { type: DataTypes.BOOLEAN },
    cual_discapacidad: { type: DataTypes.STRING },
    validado: {type: DataTypes.BOOLEAN},
    fecha_validado: {type: DataTypes.STRING},
    // fecha_alta: { type: DataTypes.DATE }
}, {
    freezeTableName: true
});


module.exports = UsuarioEliminado;