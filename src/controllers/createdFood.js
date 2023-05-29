const {Recipe, Diet} = require('../db');

const createFood = async (title, image, summary, healthScore, stepByStep, Diets)  => { 
    if(!title || !summary || !healthScore || !stepByStep || !Diets.length) throw new Error('Mandatory data is missing');

    const defaultImage = 'https://i.pinimg.com/originals/cb/2b/e0/cb2be090018cba79cf346f322826dfea.jpg';
    const newFood = await Recipe.create({
        title,
        image: image || defaultImage,
        summary,
        healthScore,
        stepByStep,
    });
    const diets = await Diet.findAll({where : { id : Diets}});

    await newFood.addDiets(diets)

    const dietName = diets.map((diet) => diet.name);
  
    return {
      id: newFood.id,
      title: newFood.title,
      image: newFood.image,
      summary: newFood.summary,
      healthScore: newFood.healthScore,
      stepByStep: newFood.stepByStep,
      created: newFood.created,
      Diets: dietName
    };
};

module.exports = {
    createFood
}