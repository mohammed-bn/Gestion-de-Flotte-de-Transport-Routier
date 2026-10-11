
const Joi = require('joi');

const createTrajet = Joi.object({
    departureLocation:  Joi.string().required(),
    arrivalLocation:    Joi.string().required(),
    departureDateTime:  Joi.date().required(),
    kmDepart:           Joi.number().min(0).required(),
    chauffeur:          Joi.string().required(),
    camion:             Joi.string().required(),
    remorque:           Joi.string().required(),
});

const updateTrajet = Joi.object({
    departureLocation: Joi.string(),
    arrivalLocation:   Joi.string(),
    departureDateTime: Joi.date(),
    arrivalDateTime:   Joi.date(),
    kmDepart:          Joi.number().min(0),
    kmArrivee:         Joi.number().min(0),
    chauffeur:         Joi.string(),
    camion:            Joi.string(),
    remorque:          Joi.string(),
});

module.exports = { createTrajet, updateTrajet };