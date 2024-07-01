import Pet from "./petModel.js";

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

export const sanitizePetUserInput = (pet) => {
  const petValidationSchema = Pet.schema.obj;
  // remove all properties not in the PetModel.js schema
  // throw error if the user passes 3 invalid properties
  let invalidFieldsCount = 0;
  const keys = Object.keys(pet);
  for (let key of keys) {
    if (!petValidationSchema[key]) {
      delete pet[key];
      invalidFieldsCount++;
      if (invalidFieldsCount >= 3) {
        throw { name: "CustomError", code: 400, messages: ["Too many invalid fields"] };
      }
    }
  }
};
