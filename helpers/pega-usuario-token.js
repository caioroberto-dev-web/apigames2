const jwt = require("jsonwebtoken");

const Usuario = require("../models/Usuario");

const secretKey = process.env.SECRETKEY;

const pegaUsuarioToken = async (token, res) => {
  if (!token) {
    return res?.status(401).json({ message: "Não autorizado!" });
  }

  const decoded = jwt.verify(token, `${secretKey}`);

  const idUsuario = decoded.id;

  const usuario = await Usuario.findOne({ where: { idUsuario: idUsuario } });

  return usuario;
};

module.exports = pegaUsuarioToken;
