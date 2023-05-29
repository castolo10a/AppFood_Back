const axios = require('axios');
const {Diet, API_KEY} = require('../db');

const URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`;

const getApiDiets = async () => {
    const apiDiets = (await axios.get(`${URL}`)).data.results;
    
    const diets = apiDiets.reduce((acc, diet) => {
        if (diet.diets) {
            const names = diet.diets.map(name => name.trim());
            names.forEach(name => {
                const found = acc.find(obj => obj.name.toLowerCase() === name.toLowerCase());
                if (!found) {
                    acc.push({ name });
                }
            });
        }
        return acc;
    }, []);
    return diets.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
};

const saveApiDiets = async () => {
    const allDiets = await getApiDiets();
    return await Diet.bulkCreate(allDiets);
}

module.exports = saveApiDiets;