const {Router} = require('express');
const {getAllDiets} = require('../controllers/getAllDiets')

const dietsRouter = Router();

dietsRouter.get('/', async (req, res) => {
    try {
        const results = await getAllDiets();
        res.status(200).json(results)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
})

module.exports = {
    dietsRouter
};