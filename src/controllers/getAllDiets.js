const {Diet} = require('../db');

const getAllDiets = async () => await Diet.findAll();

module.exports = {
    getAllDiets
}