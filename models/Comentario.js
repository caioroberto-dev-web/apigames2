const { DataTypes } = require("sequelize");

const db = require("../db/conn");

const Noticia = require("./Noticia");

const Comentario = db.define(
  "Comentario",
  {
    idComentario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    idNoticia: {
      type: DataTypes.INTEGER,
      references: {
        model: Noticia,
        key: "idNoticia",
      },
    },
    titulo: {
      type: DataTypes.STRING,
    },
    comentario: {
      type: DataTypes.STRING,
    },
    avaliacao: {
      type: DataTypes.STRING,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
    },
    nome_de_usuario: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.INTEGER,
    },
    bio: {
      type: DataTypes.STRING,
    },
  },
  { db, modelName: "Comentario", tableName: "Comentarios", timestamps: true }
);

module.exports = Comentario;
