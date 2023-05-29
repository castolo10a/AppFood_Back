require('dotenv').config();
const { Sequelize } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST, API_KEY, DB_DEPLOY } = process.env;
const recipeModel = require('./models/Recipe');
const dietModel = require('./models/Diet')

// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/food`, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });

const sequelize = new Sequelize(DB_DEPLOY, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});

recipeModel(sequelize);
dietModel(sequelize);

// Para relacionarlos hacemos un destructuring
const { Recipe, Diet } = sequelize.models;

// Aca vendrian las relaciones
Recipe.belongsToMany(Diet, {
  through: 'RecipeDiet',
  timestamps: false
});
Diet.belongsToMany(Recipe, {
  through: 'RecipeDiet',
  timestamps: false
});

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  sequelize,
  API_KEY
};
