import asyncHandler from "../../utils/asyncHandler.js";
import Pet from "./petModel.js";

// validations
import { petCreateSchema } from "./petValidation.js";

// helper functions
import { sanitizePetReturn, sanitizePetListReturn } from "./petHelpers.js";

// POST /api/pet/ | Create a pet
export const petCreate = asyncHandler(async (req, res) => {
  const petObj = {
    refUser_id: req.user._id,
    name: req.body.name ? req.body.name : undefined,
  };

  await petCreateSchema.validate(petObj, { abortEarly: false });

  const newPet = new Pet(petObj);
  await newPet.save();

  res.send({ pet: sanitizePetReturn(newPet), messages: ["Pet created"] });
});

// GET /api/pet/ | List all pets
export const petGetAll = asyncHandler(async (req, res) => {
  const pets = await Pet.find({ refUser_id: req.user._id });
  res.send({ pets: sanitizePetListReturn(pets) });
});

// GET /api/pet/:pet_id | Read a pet
export const petGetOne = asyncHandler(async (req, res) => {
  const pet = await Pet.findOne({ _id: req.params.pet_id, refUser_id: req.user._id });
  if (!pet) throw { name: "CustomError", code: 404, messages: ["Pet not found"] };

  res.send({ pet: sanitizePetReturn(pet) });
});

// PATCH /api/pet/:pet_id | Update a pet

// DELETE /api/pet/:pet_id | Delete a pet
