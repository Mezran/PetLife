export const sanitizePetReturn = (pet) => {
  const sanitizedPet = pet.toObject();
  delete sanitizedPet.__v;
  delete sanitizedPet.refUser_id;
  return sanitizedPet;
};

export const sanitizePetListReturn = (pets) => {
  // return name and _id only
  return pets.map((pet) => {
    return {
      _id: pet._id,
      name: pet.name,
    };
  });
};
