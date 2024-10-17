const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "blog_games.sqlite",
});

try {
  sequelize.authenticate();
  console.log("Conectou com sucesso!");
} catch (error) {
  console.log("Houve um erro", error);
}

module.exports = sequelize;
