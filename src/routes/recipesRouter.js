const {Router} = require('express');
const {getAllFoods, searchFoodsByName} = require('../controllers/getFoods')
const {getFoodById} = require('../controllers/getFoodById');
const {createFood} = require('../controllers/createdFood');

const recipesRouter = Router();

recipesRouter.get('/:id', async (req, res) => {
    const {id} = req.params;
    const search = isNaN(id) ? "bdd" : "api";
    try {
        const food = await getFoodById(id, search);
        res.status(200).json(food)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
})

recipesRouter.get('/', async (req, res) => {
    const {name} = req.query;
    try {
        const results = name ? await searchFoodsByName(name) : await getAllFoods();
       res.status(200).json(results);
    } catch (error) {
        res.status(404).json({error: error.message})
    }
});

recipesRouter.post('/', async (req, res) => {
    const {title, image, summary, healthScore, stepByStep, Diets} = req.body;
    try {
        const newFood = await createFood(title, image, summary, healthScore, stepByStep, Diets);
        res.status(201).json(newFood);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
})

module.exports = {
    recipesRouter
};