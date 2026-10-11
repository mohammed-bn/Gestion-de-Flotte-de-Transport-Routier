const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');


exports.protect = asyncHandler(async (req, res, next) => {
  let token;

 
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Non authentifié. Token requis.');
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id)
      .populate('role')
      .select('-password -refreshToken');

    if (!user) {
      throw new ApiError(401, 'Utilisateur introuvable');
    }

   
    if (user.statusUser === 'suspendu') {
      throw new ApiError(403, 'Compte suspendu. Contactez l\'administrateur.');
    }
    if (user.statusUser === 'inactif') {
      throw new ApiError(403, 'Compte inactif');
    }

    
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Token invalide');
    }
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token expiré');
    }
    throw err;
  }
});


exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Non authentifié'));
    }

    if (!roles.includes(req.user.role.role)) {
      return next(
        new ApiError(
          403,
          `Accès refusé. Rôle requis: ${roles.join(' ou ')}`
        )
      );
    }
    next();
  };
};


exports.checkOwnership = (resourceField = 'chauffeur') => {
  return (req, res, next) => {
    
    if (req.user.role.role === 'admin') return next();

    
    const resourceOwner = req.resource?.[resourceField];
    if (!resourceOwner || resourceOwner.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, 'Accès interdit à cette ressource'));
    }
    next();
  };
};