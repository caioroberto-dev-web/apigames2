const jwt = require("jsonwebtoken");

const resgataToken = require("./resgata-token");

const secretKey = process.env.SECRETKEY;

const checaToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Não autorizado!" });
  }

  const token = resgataToken(req);

  if (!token) {
    return res.status(401).json({ message: "Não autorizado!" });
  }

  try {
    const verified = jwt.verify(token, `${secretKey}`);

    req.usuario = verified;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido!" });
  }
};

module.exports = checaToken;
