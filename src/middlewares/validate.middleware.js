const ApiError = require('../utils/ApiError');


const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,      
      stripUnknown: true,     
      convert: true           
    });

    if (error) {
      const messages = error.details.map((d) => d.message).join(', ');
      return next(new ApiError(400, `Validation échouée: ${messages}`));
    }

    
    req[source] = value;
    next();
  };
};

module.exports = validate;