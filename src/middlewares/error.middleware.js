const ApiError = require('../utils/ApiError');


const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;


  if (process.env.NODE_ENV === 'development') {
    console.error('Erreur:', err);
  }


  if (err.name === 'CastError') {
    error.message = `Ressource introuvable. ID invalide: ${err.value}`;
    error.statusCode = 404;
  }

 
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error.message = `Validation échouée: ${messages.join(', ')}`;
    error.statusCode = 400;
  }

  
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `Valeur dupliquée pour le champ "${field}": ${err.keyValue[field]}`;
    error.statusCode = 409;
  }

 

  if (err.name === 'JsonWebTokenError') {
    error.message = 'Token invalide';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expiré';
    error.statusCode = 401;
  }



  res.status(error.statusCode).json({
    success: false,
    message: error.message || 'Erreur serveur',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  });
};

module.exports = errorHandler;