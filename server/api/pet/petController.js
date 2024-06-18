import asyncHandler from "../../utils/asyncHandler.js";
import Pet from "./petModel.js";

// validations
import {
  petCreateValidationSchema,
  petGetAllValidationSchema,
  petGetOneValidationSchema,
  petUpdateValidationSchema,
  petDeleteValidationSchema,
} from "./petValidation.js";

// helper functions
import { sanitizePetReturn, sanitizePetListReturn } from "./petHelpers.js";

// POST /api/pet/ | Create a pet
export const petCreate = asyncHandler(async (req, res) => {
  const petObj = {
    refUser_id: req.user._id,
    name: req.body.name ? req.body.name : undefined,
  };

  await petCreateValidationSchema.validate(petObj, { abortEarly: false });

  const newPet = new Pet(petObj);
  await newPet.save();

  res.send({ pet: sanitizePetReturn(newPet), messages: ["Pet created"] });
});

// GET /api/pet/ | List all pets
export const petGetAll = asyncHandler(async (req, res) => {
  await petGetAllValidationSchema.validate(
    { refUser_id: req.user._id },
    { abortEarly: false }
  );
  const pets = await Pet.find({ refUser_id: req.user._id });
  res.send({ pets: sanitizePetListReturn(pets) });
});

// GET /api/pet/:pet_id | Read a pet
export const petGetOne = asyncHandler(async (req, res) => {
  // validate user._id and params.pet_id are valid mongoose ObjectIds
  await petGetOneValidationSchema.validate(
    { refUser_id: req.user._id, pet_id: req.params.pet_id },
    { abortEarly: false }
  );

  const pet = await Pet.findOne({ _id: req.params.pet_id, refUser_id: req.user._id });
  if (!pet) throw { name: "CustomError", code: 404, messages: ["Pet not found"] };

  res.send({ pet: sanitizePetReturn(pet) });
});

// PATCH /api/pet/:pet_id | Update a pet
export const petUpdate = asyncHandler(async (req, res) => {
  const petObj = {
    refUser_id: req.user._id,
    pet_id: req.params.pet_id,
    name: req.body.name ? req.body.name : undefined,
  };

  await petUpdateValidationSchema.validate(petObj, { abortEarly: false });

  const pet = await Pet.findOneAndUpdate(
    { _id: req.params.pet_id, refUser_id: req.user._id },
    petObj,
    { new: true }
  );
  if (!pet) throw { name: "CustomError", code: 404, messages: ["Pet not found"] };

  res.send({ pet: sanitizePetReturn(pet), messages: ["Pet updated"] });
});

// DELETE /api/pet/:pet_id | Delete a pet
export const petDelete = asyncHandler(async (req, res) => {
  await petGetOneValidationSchema.validate(
    { refUser_id: req.user._id, pet_id: req.params.pet_id },
    { abortEarly: false }
  );

  const pet = await Pet.findOneAndDelete({
    _id: req.params.pet_id,
    refUser_id: req.user._id,
  });
  if (!pet) throw { name: "CustomError", code: 404, messages: ["Pet not found"] };

  res.send({ pet: sanitizePetReturn(pet), messages: ["Pet deleted"] });
});
