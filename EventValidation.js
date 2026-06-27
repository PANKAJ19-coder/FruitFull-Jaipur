const joi= require('joi');

const eventvalidation= joi.object({
    event:joi.object({
        title:joi.string().required(),
        detail:joi.string().required()
    }).required()
});

module.exports= eventvalidation;