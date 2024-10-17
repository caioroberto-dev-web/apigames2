const Noticia = require("../models/Noticia");

const pegaUsuarioToken = require("../helpers/pega-usuario-token");

const pegaToken = require("../helpers/resgata-token");

const servidor_ip = process.env.SERVIDOR_IP;

module.exports = class NoticiaController {
  static async postandoNoticia(req, res) {
    let { titulo, plataforma, image, descricao, avaliacao } = req.body;

    let token = await pegaToken(req);
    let dados = await pegaUsuarioToken(token);

    let usuario = dados.dataValues;
    console.log(usuario.tipo);
    if (usuario.tipo !== "admin") {
      res.status(403).json({ message: "Acesso negado!" });
      return;
    }

    if (!titulo || !plataforma || !req.file || !descricao) {
      res.status(422).json({ message: "Preencha todos os dados!" });
      return;
    }

    image = `${servidor_ip}/images/${req.file.filename}`;

    const noticia = {
      titulo,
      autor: usuario.nome,
      plataforma,
      image,
      descricao,
      avaliacao,
      idPost: usuario.idUsuario,
      img_autor: usuario.image,
      bio: usuario.bio,
      comentario: [],
    };

    await Noticia.create(noticia);

    res.status(201).json({ message: "Noticia postada com sucesso!" });
  }

  static async editarNoticia(req, res) {
    let idNoticia = req.params.id;

    const noticia = await Noticia.findOne({
      where: { idNoticia: idNoticia },
      raw: true,
    });

    if (!noticia) {
      res.status(404).json({ message: "Noticia não encontrada!" });
      return;
    }

    let { titulo, plataforma, image, descricao, avaliacao } = req.body;

    let token = await pegaToken(req);
    let dados = await pegaUsuarioToken(token);

    let usuario = dados.dataValues;

    let updateNoticia = {};

    if (usuario.tipo !== "admin") {
      res.status(403).json({ message: "Acesso negado!" });
      return;
    }

    if (!titulo) {
      res.status(422).json({ message: "Preencha o campo de título!" });
      return;
    }

    updateNoticia.titulo = titulo;

    if (!plataforma) {
      res.status(422).json({ message: "Preencha o campo de plataforma!" });
      return;
    }
    updateNoticia.plataforma = plataforma;

    if (!req.file) {
      res.status(422).json({ message: "Preencha o campo com a imagem!" });
      return;
    }
    updateNoticia.image = req.file;

    if (!descricao) {
      res.status(422).json({ message: "Preencha o campo de descrição!" });
      return;
    }
    updateNoticia.descricao = descricao;

    updateNoticia.avaliacao = avaliacao;

    image = `${servidor_ip}/images/${req.file.filename}`;

    updateNoticia = {
      titulo,
      autor: usuario.nome,
      plataforma,
      image,
      descricao,
      avaliacao,
      idPost: usuario.idUsuario,
    };

    await Noticia.update(updateNoticia, { where: { idNoticia: idNoticia } });

    res.status(201).json({ message: "Noticia atualiza com sucesso!" });
  }

  static async excluirNoticia(req, res) {
    let idNoticia = req.params.id;

    let token = await pegaToken(req);
    let dados = await pegaUsuarioToken(token);

    let usuario = dados.dataValues;

    if (usuario.tipo !== "admin") {
      res.status(403).json({ message: "Acesso negado!" });
      return;
    }

    const noticia = await Noticia.findOne({
      where: { idNoticia: idNoticia },
      raw: true,
    });

    if (!noticia) {
      res.status(404).json({ message: "Noticia não encontrada!" });
      return;
    }

    await Noticia.destroy({ where: { idNoticia: idNoticia } });

    res.status(201).json({ message: "Noticia excluida com sucesso!" });
  }

  static async todasNoticias(req, res) {
    let lista = await Noticia.findAll({ raw: true });

    res.status(201).json({ lista: lista });
  }

  static async slideNoticias(req, res) {
    let slide = await Noticia.findAll({ raw: true });

    let ultimosSlides = slide.slice(slide.length - 3);

    res.status(201).json({ ultimosSlides: ultimosSlides });
  }

  static async PCNoticias(req, res) {
    let plataforma = "pc";

    let pc = await Noticia.findAll({
      where: { plataforma: plataforma },
      raw: true,
    });

    res.status(201).json({ pc: pc });
  }

  static async PSXNoticias(req, res) {
    let plataforma = "playstation";

    let psx = await Noticia.findAll({
      where: { plataforma: plataforma },
      raw: true,
    });

    res.status(201).json({ psx: psx });
  }

  static async XboxNoticias(req, res) {
    let plataforma = "xbox";

    let xbox = await Noticia.findAll({
      where: { plataforma: plataforma },
      raw: true,
    });

    res.status(201).json({ xbox: xbox });
  }

  static async NSNoticias(req, res) {
    let plataforma = "nintendoSwitch";

    let ns = await Noticia.findAll({
      where: { plataforma: plataforma },
      raw: true,
    });

    res.status(201).json({ ns: ns });
  }

  static async MobNoticias(req, res) {
    let plataforma = "mobile";

    let mob = await Noticia.findAll({
      where: { plataforma: plataforma },
      raw: true,
    });

    res.status(201).json({ mob: mob });
  }

  static async detalhesNoticia(req, res) {
    let idNoticia = req.params.id;

    const noticia = await Noticia.findAll({
      where: { idNoticia: idNoticia },
      raw: true,
    });

    //console.log(noticia);

    if (!noticia) {
      return res.status(404).json({ message: "Pagina não encontrada!" });
    }

    res.status(201).json({ noticia: noticia });
  }
};
