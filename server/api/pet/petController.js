import asyncHandler from "../../utils/asyncHandler.js";
import Pet from "./petModel.js";

// validations
import { petCreateSchema } from "./petValidation.js";

// helper functions
import { sanitizePetReturn } from "./petHelpers.js";

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

// GET /api/pet/:pet_id | Read a pet

// PATCH /api/pet/:pet_id | Update a pet

// DELETE /api/pet/:pet_id | Delete a pet
