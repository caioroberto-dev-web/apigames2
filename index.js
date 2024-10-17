const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv/config");

const porta = process.env.PORTA;
const origin_ip = process.env.ORIGIN_IP;

const conn = require("./db/conn");

const routes = require("./routes/routes");

const Usuario = require("./models/Usuario");
const Noticia = require("./models/Noticia");
const Comentario = require("./models/Comentario");

const UsuarioController = require("./controllers/UsuarioController");
const NoticiaController = require("./controllers/NoticiaController");
const ComentarioController = require("./controllers/ComentarioController");

app.use(cors({ credentials: true, origin: `${origin_ip}` }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));

app.use(routes, cors());

conn
  //.sync({ force: true })
  .sync()
  .then(() => {
    app.listen(porta);
    console.log(`Servidor rodando na porta ${porta}`);
  })
  .catch((err) => {
    console.log(err);
  });
