const Role = require('../models/Role');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');



exports.createRole = async (data) => {
  const exists = await Role.findOne({ role: data.role });
  if (exists) throw new ApiError(409, `Le rôle "${data.role}" existe déjà`);

  const role = await Role.create(data);
  return role;
};



exports.getAllRoles = async () => {
  const roles = await Role.find().sort({ role: 1 });


  const rolesWithCount = await Promise.all(
    roles.map(async (r) => {
      const count = await User.countDocuments({ role: r._id });
      return {
        ...r.toObject(),
        usersCount: count
      };
    })
  );

  return rolesWithCount;
};

exports.getRoleById = async (id) => {
  const role = await Role.findById(id);
  if (!role) throw new ApiError(404, 'Rôle introuvable');

  const usersCount = await User.countDocuments({ role: id });

  return {
    ...role.toObject(),
    usersCount
  };
};

exports.getRoleByName = async (name) => {
  const role = await Role.findOne({ role: name });
  if (!role) throw new ApiError(404, `Rôle "${name}" introuvable`);
  return role;
};



exports.updateRole = async (id, data) => {
  const role = await Role.findById(id);
  if (!role) throw new ApiError(404, 'Rôle introuvable');

  // Vérifier unicité si on change le nom
  if (data.role && data.role !== role.role) {
    const exists = await Role.findOne({ role: data.role, _id: { $ne: id } });
    if (exists) throw new ApiError(409, `Le rôle "${data.role}" existe déjà`);

   
    if (['admin', 'chauffeur'].includes(role.role)) {
      throw new ApiError(
        400,
        `Impossible de renommer le rôle système "${role.role}"`
      );
    }
  }

  Object.assign(role, data);
  await role.save();
  return role;
};



exports.deleteRole = async (id) => {
  const role = await Role.findById(id);
  if (!role) throw new ApiError(404, 'Rôle introuvable');


  if (['admin', 'chauffeur'].includes(role.role)) {
    throw new ApiError(
      400,
      `Impossible de supprimer le rôle système "${role.role}"`
    );
  }

  const usersCount = await User.countDocuments({ role: id });
  if (usersCount > 0) {
    throw new ApiError(
      409,
      `Impossible de supprimer : ${usersCount} utilisateur(s) utilisent ce rôle`
    );
  }

  await role.deleteOne();
  return role;
};


exports.seedDefaultRoles = async () => {
  const defaults = [
    { role: 'admin', description: 'Administrateur - accès complet' },
    { role: 'chauffeur', description: 'Chauffeur - accès à ses trajets' }
  ];

  for (const r of defaults) {
    await Role.updateOne(
      { role: r.role },
      { $setOnInsert: r },
      { upsert: true }
    );
  }

  return Role.find();
};