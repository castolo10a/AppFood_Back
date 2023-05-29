const axios = require('axios');
const {Sequelize} = require('sequelize');
const {Recipe, Diet, API_KEY} = require('../db')

const URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`;

const stripHtmlTags = (htmlString) => {
  return htmlString.replace(/<[^>]*>?/gm, '');
};

const getFoodObject = (food, isDb) => {
    const diets = isDb
      ? food.Diets.map((diet) => diet.name)
      : food.diets.length
      ? food.diets
      : "Has no related diets";

    const steps = isDb
      ? food.stepByStep || 'No steps available'
      : food.analyzedInstructions
      ? food.analyzedInstructions.length
        ? food.analyzedInstructions[0].steps.map(step => stripHtmlTags(step.step))
        : 'No steps available'
      : 'No instructions available';
  
    return {
      id: food.id,
      title: food.title,
      summary: stripHtmlTags(food.summary),
      healthScore: food.healthScore,
      stepByStep: steps,
      image: food.image,
      created: isDb ? food.created : false,
      Diets: diets,
    };
};
  
const getAllFoods = async () => {

    const dbfoods = await Recipe.findAll({
        include: [{ model: Diet, through: { attributes: [] } }]
    });

    const foodsDb = dbfoods.map(food => getFoodObject(food, true));

    const apiFoods = (await axios.get(`${URL}`)).data.results;
    const foodsApi = apiFoods.map(food => getFoodObject(food, false));

    return [...foodsDb, ...foodsApi];
};

const searchFoodsByName = async(name) => {
   
    if(name.length < 4) throw new Error('Must be at least 4 characters long');
     
    const foodsDb = await Recipe.findAll({
      where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('Recipe.title')), 'LIKE', `%${name.toLowerCase()}%`),
      include: [{ model: Diet, through: { attributes: [] } }]
    });
  
    const foodsByNameDB = foodsDb.map(food => getFoodObject(food, true));
  

    const apiFoods = (await axios.get(`${URL}`)).data.results;
    const foodsByNameApi = apiFoods
    .filter(food => food.title.toLowerCase().includes(name.toLowerCase()))
    .map(food => getFoodObject(food, false));
  
    if(!foodsByNameApi.length && !foodsByNameDB.length) throw new Error(`Food not found with requested ${name} name`);
  
    return [...foodsByNameDB, ...foodsByNameApi];
}

module.exports = {
    getFoodObject,
    getAllFoods,
    searchFoodsByName
}