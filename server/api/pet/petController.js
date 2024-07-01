import asyncHandler from "../../utils/asyncHandler.js";
import Pet from "./petModel.js";

// validations
import { petValidationSchema, petMongooseObjectId } from "./petValidation.js";

// helper functions
import {
  sanitizePetReturn,
  sanitizePetListReturn,
  sanitizePetUserInput,
} from "./petHelpers.js";

// POST /api/pet/ | Create a pet
export const petCreate = asyncHandler(async (req, res) => {
  await sanitizePetUserInput(req.body);

  let newPet = new Pet({ ...req.body });
  newPet.refUser_id = req.user._id;

  await petValidationSchema.validate(newPet, { abortEarly: false });

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
  await petMongooseObjectId.validate(req.params.pet_id, { abortEarly: false });

  const pet = await Pet.findOne({ _id: req.params.pet_id, refUser_id: req.user._id });
  if (!pet) throw { name: "CustomError", code: 404, messages: ["Pet not found"] };

  res.send({ pet: sanitizePetReturn(pet) });
});

// PATCH /api/pet/:pet_id | Update a pet
export const petUpdate = asyncHandler(async (req, res) => {
  await sanitizePetUserInput(req.body);
  await petMongooseObjectId.validate(req.params.pet_id, { abortEarly: false });

  let updatePet = new Pet({ ...req.body });
  updatePet._id = req.params.pet_id;
  updatePet.refUser_id = req.user._id;

  await petValidationSchema.validate(updatePet, { abortEarly: false });

  const postUpdatedPet = await Pet.findOneAndUpdate(
    { _id: req.params.pet_id, refUser_id: req.user._id },
    updatePet,
    { new: true }
  );
  if (!postUpdatedPet)
    throw { name: "CustomError", code: 404, messages: ["Pet not found"] };

  res.send({ pet: sanitizePetReturn(postUpdatedPet), messages: ["Pet updated"] });
});

// DELETE /api/pet/:pet_id | Delete a pet
export const petDelete = asyncHandler(async (req, res) => {
  await petMongooseObjectId.validate(req.params.pet_id, { abortEarly: false });

  const pet = await Pet.findOneAndDelete({
    _id: req.params.pet_id,
    refUser_id: req.user._id,
  });
  if (!pet) throw { name: "CustomError", code: 404, messages: ["Pet not found"] };

  res.send({ pet: sanitizePetReturn(pet), messages: ["Pet deleted"] });
});
