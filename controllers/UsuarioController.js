const Usuario = require("../models/Usuario");

const jwt = require("jsonwebtoken");

const criaToken = require("../helpers/cria-token");

const resgataToken = require("../helpers/resgata-token");

const pegaUsuarioToken = require("../helpers/pega-usuario-token");

const bcrypt = require("bcrypt");

const servidor_ip = process.env.SERVIDOR_IP;

module.exports = class UsuarioController {
  static async cadastro(req, res) {
    let {
      nome,
      nome_de_usuario,
      email,
      senha,
      confirmaSenha,
      image,
      bio,
      palavraSecreta,
    } = req.body;

    if (!nome) {
      res.status(422).json({ message: "O campo nome é necessário preencher!" });
      return;
    }

    if (!nome_de_usuario) {
      res
        .status(422)
        .json({ message: "O campo nome de usuário é necessário preencher!" });
      return;
    } else if (nome_de_usuario.length < 3 || nome_de_usuario.length > 20) {
      res.status(422).json({
        message:
          "O nome de usuario deve no mínimo 3 caracteres e no máximo 20 caracteres!",
      });
      return;
    }

    if (!email) {
      res
        .status(422)
        .json({ message: "O campo email é necessário preencher!" });
      return;
    }

    const emailExiste = await Usuario.findOne({ where: { email: email } });

    if (emailExiste) {
      res
        .status(422)
        .json({ message: "Email já em uso em nosso sistema, tente outro!" });
      return;
    }

    let regex =
      /^(?=.*[@!#$%^&*()/\\])(?=.*[0-9])(?=.*[a-zA-Z])[@!#$%^&*()/\\a-zA-Z0-9]{6,20}$/;

    if (regex.test(senha) == false) {
      res.status(422).json({
        message:
          "A senha deve conter no mínimo 6 caracteres, pelo menos um caractere especial, uma letra e um número!",
      });
      return;
    }

    if (!senha) {
      res
        .status(422)
        .json({ message: "O campo senha é necessário preencher!" });
      return;
    }

    if (!confirmaSenha) {
      res
        .status(422)
        .json({ message: "O campo confirma senha é necessário preencher!" });
      return;
    }

    if (senha !== confirmaSenha) {
      res.status(422).json({
        message:
          "A senha e confirmação de senha não são iguais, tente novamente!",
      });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);

    if (!req.file) {
      res.status(422).json({ message: "Insira uma imagem de perfil!" });
      return;
    }

    image = req.file.filename;

    image = `${servidor_ip}/images/${image}`;

    if (!palavraSecreta) {
      res.status(422).json({
        message:
          "Insira uma palavra secreta para caso esqueça a sua senha de acesso!",
      });
      return;
    }

    const usuario = {
      nome,
      nome_de_usuario,
      email,
      senha: senhaHash,
      image: image,
      tipo: "usuario",
      bio,
      palavraSecreta,
    };

    try {
      const novoUsuario = await Usuario.create(usuario);

      await criaToken(novoUsuario, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async login(req, res) {
    let { email, senha } = req.body;

    if (!email) {
      res.status(422).json({ message: "Campo de email é obrigatório!" });
      return;
    }

    const checaDados = await Usuario.findOne({ where: { email: email } });

    if (!checaDados) {
      res.status(422).json({
        message: "Email de usuário não é cadastrado no nosso sistema!",
      });
      return;
    }

    if (!senha) {
      res.status(422).json({ message: "Campo de senha é obrigatório!" });
      return;
    }

    const comparaSenha = bcrypt.compareSync(senha, checaDados.senha);

    if (!comparaSenha) {
      res.status(422).json({ message: "Senha inválida!" });
      return;
    }

    await criaToken(checaDados, req, res);
  }

  static async perfilUsuario(req, res) {
    let idUsuario = req.params.id;

    const token = resgataToken(req);

    const perfilUsuario = await Usuario.findOne({
      where: { idUsuario: idUsuario },
      raw: true,
    });

    const usuario = await pegaUsuarioToken(token);

    if (!perfilUsuario) {
      res.status(400).json({ message: "Usuário não cadastrado no sistema!" });
      return;
    }

    if (idUsuario != usuario.idUsuario) {
      res.json({ message: "Acesso negado!" });
      return;
    }

    let {
      nome,
      nome_de_usuario,
      email,
      senha,
      confirmaSenha,
      image,
      bio,
      palavraSecreta,
    } = req.body;

    let updatePerfil = {};

    if (!nome) {
      res.status(422).json({ message: "O campo nome é obrigatório!" });
      return;
    }

    updatePerfil.nome = nome;

    if (!nome_de_usuario) {
      res
        .status(422)
        .json({ message: "O campo nome de usuário é obrigatório!" });
      return;
    }
    updatePerfil.nome_de_usuario = nome_de_usuario;

    if (!email) {
      res.status(422).json({ message: "O campo e-mail é obrigatório!" });
      return;
    }

    updatePerfil.email = email;

    if (!senha) {
      res.status(422).json({ message: "O campo senha é obrigatório!" });
      return;
    }

    updatePerfil.senha = senha;

    if (senha != confirmaSenha) {
      res
        .status(422)
        .json({ message: "Senha e confirmação de senha devem ser iguais!" });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);

    if (!req.file) {
      res
        .status(422)
        .json({ message: "O campo de imagem de perfil é obrigatório!" });
      return;
    }
    updatePerfil.image = image;

    image = req.file.filename;

    image = `${servidor_ip}/images/${image}`;

    let updateUsuario = {
      nome,
      email,
      senha: senhaHash,
      image,
      bio,
      palavraSecreta,
    };

    await Usuario.update(updateUsuario, { where: { idUsuario: idUsuario } });

    res.status(200).json({ message: "Perfil atualizado com sucesso!" });
  }

  static async checaUsuario(req, res) {
    let usuarioAtual;

    let secretKey = process.env.SECRETKEY;

    if (req.headers.authorization) {
      const token = resgataToken(req);

      const decoded = jwt.verify(token, `${secretKey}`);

      usuarioAtual = await Usuario.findByPk(decoded.id);

      usuarioAtual.senha = undefined;
    } else {
      usuarioAtual = null;

      return;
    }

    res.status(201).json(usuarioAtual);
  }

  static async recuperaSenha(req, res) {
    let { email, palavraSecreta } = req.body;

    if (!email) {
      res.status(422).json({ message: "Insira o seu e-mail de cadastro!" });
      return;
    }

    let dadosExistem = await Usuario.findOne({
      where: { email: email },
      raw: true,
    });

    if (!dadosExistem) {
      res.status(404).json({ message: "E-mail não cadastrado no sistema!" });
      return;
    }

    if (!palavraSecreta) {
      res.status(422).json({ message: "Insira a sua palavra secreta!" });
      return;
    }

    if (dadosExistem.palavraSecreta != palavraSecreta) {
      res.status(422).json({ message: "Palavra secreta inválida!" });
      return;
    }

    await criaToken(dadosExistem, req, res);
  }

  static async novaSenha(req, res) {
    const token = await resgataToken(req);

    const usuario = await pegaUsuarioToken(token);

    let idUsuario = usuario.idUsuario;

    let { senha, confirmaSenha } = req.body;

    if (!senha) {
      res.status(422).json({ message: "Insira uma senha!" });
      return;
    } else if (!confirmaSenha) {
      res.status(422).json({ message: "Insira a confirmação de senha!" });
      return;
    } else if (senha != confirmaSenha) {
      res
        .status(422)
        .json({ message: "As senhas não coincidem, tente novamente!" });
      return;
    }

    let regex =
      /^(?=.*[@!#$%^&*()/\\])(?=.*[0-9])(?=.*[a-zA-Z])[@!#$%^&*()/\\a-zA-Z0-9]{6,20}$/;

    if (regex.test(senha) == false) {
      res.status(422).json({
        message:
          "A senha deve conter no mínimo 6 caracteres, pelo menos um caractere especial, uma letra e um número ",
      });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);

    let novaSenha = {
      senha: senhaHash,
    };

    await Usuario.update(novaSenha, { where: { idUsuario: idUsuario } });

    res.status(201).json({ message: "Senha nova criada com sucesso!" });
  }
};
