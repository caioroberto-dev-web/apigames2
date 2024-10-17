const { DataTypes } = require("sequelize");

const db = require("../db/conn");

const Usuario = require("./Usuario");

const Noticia = db.define(
  "Noticia",
  {
    idNoticia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    idPost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "idUsuario",
      },
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plataforma: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avaliacao: {
      type: DataTypes.STRING,
    },
    img_autor: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.STRING,
    },
  },
  { db, modelName: "Noticia", tableName: "Noticias", timestamps: true }
);

module.exports = Noticia;
