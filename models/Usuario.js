const { DataTypes } = require("sequelize");

const db = require("../db/conn");

const Usuario = db.define(
  "Usuario",
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nome_de_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.STRING,
    },
    palavraSecreta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { db, modelName: "Usuario", tableName: "Usuarios", timestamps: true }
);

module.exports = Usuario;
