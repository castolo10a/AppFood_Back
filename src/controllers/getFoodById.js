const axios = require('axios');
const {Recipe, Diet, API_KEY} = require('../db');
const {getFoodObject} = require('./getFoods');

const URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`;

const getFoodById = async (id, search) => {
  const data = search === 'api'
    ? (await axios.get(`${URL}`)).data.results.find(food => food.id === Number(id))
    : await Recipe.findByPk(id, {
        include: [{
          model: Diet,
          attributes: ['name'],
          through: { attributes: [] }
        }]
      });

  if (!data) throw new Error(`Food with ID: ${id} not found`);

  return search === 'api' ? getFoodObject(data, false) : getFoodObject(data, true)
}
module.exports = {
    getFoodById
}