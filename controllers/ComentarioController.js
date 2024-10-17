const Comentario = require("../models/Comentario");

const Noticia = require("../models/Noticia");

const pegaToken = require("../helpers/resgata-token");

const pegaUsuarioToken = require("../helpers/pega-usuario-token");

module.exports = class ComentarioController {
  static async comentar(req, res) {
    let idNoticia = req.params.id;

    let noticia = await Noticia.findAll({
      where: { idNoticia: idNoticia },
      raw: true,
    });

    let token = await pegaToken(req);

    let dados = await pegaUsuarioToken(token);

    let usuario = dados.dataValues;

    let avaliou = await Comentario.findAll({
      where: { idUsuario: usuario.idUsuario },
      raw: true,
    });

    let { comentario, avaliacao } = req.body;

    if (comentario.length > 300) {
      res.status(422).json({
        message: "Comentário excedeu o limite de 300 caracteres!",
      });
      return;
    }

    if (!comentario) {
      res.status(422).json({ message: "Preencha o campo de comentário!" });
      return;
    }

    if (avaliacao < 1 || avaliacao > 5) {
      res.status(422).json({ message: "Atribua uma nota entre 1 a 5!" });
      return;
    }

    let comentar = {
      comentario,
      avaliacao,
      idUsuario: usuario.idUsuario,
      titulo: noticia[0].titulo,
      nome_de_usuario: usuario.nome_de_usuario,
      image: usuario.image,
      bio: usuario.bio,
      idNoticia,
    };

    //VALIDAÇÃO DE AVALIAÇÃO

    for (let a in avaliou) {
      let id = avaliou[a].idUsuario;

      let noticia = avaliou[a].idNoticia;

      if (id == usuario.idUsuario && noticia == idNoticia) {
        res.status(422).json({ message: "Já avaliou!" });
        return;
      }
    }

    await Comentario.create(comentar);

    res.status(201).json({ message: "Comentário enviado com sucesso!" });

    return;
  }

  static async todosComentarios(req, res) {
    let comentarios = await Comentario.findAll();

    res.status(200).json({ comentarios: comentarios });
  }

  static async meusComentarios(req, res) {
    
    let token = await pegaToken(req);

    let dados = await pegaUsuarioToken(token);

    let id = dados?.dataValues.idUsuario;

    let idUsuario = req.params.id;

    if (idUsuario != id) {
      res.status(403).json({ message: "Acesso não autorizado!" });
      return;
    }

    let comentarios = await Comentario.findAll({
      where: { idUsuario: idUsuario },
    });

    res.status(201).json({ comentarios: comentarios });
  }

  static async excluirComentario(req, res) {
    let idComentario = req.params.id;

    await Comentario.destroy({ where: { idComentario: idComentario } });

    res.status(200).json({ message: "Comentário excluido com sucesso!" });
  }

  static async qtdComentario(req, res) {
    let idNoticia = req.params.id;

    let qtdComentario = await Comentario.findAll({
      where: { idNoticia: idNoticia },
    });
    res.status(200).json({ qtdComentario: qtdComentario });
  }

  static async mediaAvaliacao(req, res) {
    let idNoticia = req.params.id;

    let comentarios = await Comentario.findAll({
      where: { idNoticia: idNoticia },
      raw: true,
    });

    let num = 0;

    let div = comentarios.length;

    for (let c in comentarios) {
      num = num + Number(comentarios[c].avaliacao);
    }

    let media = num / div;

    res.status(200).json({ media });
  }

  static async avaliacaoDetalhes(req, res) {
    let idNoticia = req.params.id;

    let comentarios = await Comentario.findAll({
      where: { idNoticia: idNoticia },
      raw: true,
    });

    let n5 = 0;
    let n4 = 0;
    let n3 = 0;
    let n2 = 0;
    let n1 = 0;

    for (let i in comentarios) {
      if (comentarios[i].avaliacao == 5) {
        n5++;
      } else if (comentarios[i].avaliacao == 4) {
        n4++;
      } else if (comentarios[i].avaliacao == 3) {
        n3++;
      } else if (comentarios[i].avaliacao == 2) {
        n2++;
      } else {
        n1++;
      }
    }

    res.status(200).json({ n5, n4, n3, n2, n1 });
  }
};
