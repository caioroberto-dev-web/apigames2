const express = require("express");

const UsuarioController = require("../controllers/UsuarioController");

const NoticiaController = require("../controllers/NoticiaController");

const ComentarioController = require("../controllers/ComentarioController");

const upload = require("../helpers/upload");

const checaToken = require("../helpers/checa-token");

const router = express.Router();

router.get("/", (req, res) => {
  res.json("Rota da API de games!");
});

router.post("/cadastro", upload.single("image"), UsuarioController.cadastro);

router.post("/login", UsuarioController.login);

router.post("/recuperasenha", UsuarioController.recuperaSenha);

router.patch(
  "/novasenha",
  upload.single("image"),
  checaToken,
  UsuarioController.novaSenha
);

router.patch(
  "/perfilusuario/:id",
  upload.single("image"),
  checaToken,
  UsuarioController.perfilUsuario
);

router.get("/checausuario", checaToken, UsuarioController.checaUsuario);

router.post(
  "/noticia",
  upload.single("image"),
  checaToken,
  NoticiaController.postandoNoticia
);

router.patch(
  "/editanoticia/:id",
  upload.single("image"),
  checaToken,
  NoticiaController.editarNoticia
);

router.delete(
  "/excluirnoticia/:id",
  checaToken,
  NoticiaController.excluirNoticia
);

router.get("/todasnoticias", NoticiaController.todasNoticias);

router.get("/slidenoticias", NoticiaController.slideNoticias);

router.get("/pcnoticias", NoticiaController.PCNoticias);

router.get("/psxnoticias", NoticiaController.PSXNoticias);

router.get("/xboxnoticias", NoticiaController.XboxNoticias);

router.get("/nsnoticias", NoticiaController.NSNoticias);

router.get("/mobnoticias", NoticiaController.MobNoticias);

router.get("/detalhes/:id", NoticiaController.detalhesNoticia);

router.post("/comentario/:id", checaToken, ComentarioController.comentar);

router.get("/todoscomentarios", ComentarioController.todosComentarios);

router.get("/meuscomentarios/:id", ComentarioController.meusComentarios);

router.delete("/excluircomentario/:id", ComentarioController.excluirComentario);

router.get("/qtdcomentario/:id", ComentarioController.qtdComentario);

router.get("/mediaavaliacao/:id", ComentarioController.mediaAvaliacao);

router.get("/avaliacaodetalhes/:id", ComentarioController.avaliacaoDetalhes);

module.exports = router;
