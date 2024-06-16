export const sanitizePetReturn = (pet) => {
  const sanitizedPet = pet.toObject();
  delete sanitizedPet.__v;
  delete sanitizedPet.refUser_id;
  return sanitizedPet;
};
