const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
        latitude:Joi.number().optional(),
        longitude:Joi.number().optional(),
        geometry: Joi.object({
            type: Joi.string().valid('Point').optional(),
            coordinates: Joi.array().items(Joi.number()).length(2).optional()
        }).optional()
    }).required()
});

module.exports.reviewSchema = Joi.object({
        review:Joi.object({
            rating:Joi.number().required().min(1).max(5),
            comment:Joi.string().required(),
        }).required()

});