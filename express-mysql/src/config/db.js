const sequelize = new Sequelize("soundcloud", "root", "", {
  host: "localhost",
  dialect: "mysql",
  raw: true,
  logging: false,
});

module.exports = sequelize;
