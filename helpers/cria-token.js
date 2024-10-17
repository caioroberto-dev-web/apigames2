const jwt = require("jsonwebtoken");

const criaToken = (usuario, req, res) => {
  const secretKey = process.env.SECRETKEY;

  const token = jwt.sign(
    {
      nome: usuario.nome,
      id: usuario.idUsuario,
    },
    `${secretKey}`,
    {
      expiresIn: 84000,
    }
  );

  res.status(201).json({
    message: "Autenticado com sucesso!",
    token: token,
    idUsuario: usuario.idUsuario,
    image: usuario.image,
    nome_de_usuario: usuario.nome_de_usuario,
    tipo: usuario.tipo,
    isLoggedIn: true,
  });
};

module.exports = criaToken;
