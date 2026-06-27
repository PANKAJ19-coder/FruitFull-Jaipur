const joi= require('joi');

const plantValidation= joi.object({
    Plant: joi.object({
        name: joi.string().required(),
        desc: joi.string().required(),
        image: joi.string().allow('', null),
    }).required(),
});
module.exports= plantValidation;