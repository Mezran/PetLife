import * as yup from "yup";
import mongoose from "mongoose";

export const petMongooseObjectId = yup
  .string()
  .test("is-valid-object-id", "${value} is not a valid ObjectId", (value) => {
    return mongoose.Types.ObjectId.isValid(value);
  });

export const petValidationSchema = yup.object().shape({
  refUser_id: yup
    .string()
    .required()
    .test("is-valid-object-id", "${value} is not a valid ObjectId", (value) => {
      return mongoose.Types.ObjectId.isValid(value);
    }),
  name: yup.string().required(),
  nickName: yup.string().optional(),
  dateOfBirth: yup
    .date()
    .optional()
    .max(new Date(), "Date of Birth cannot be in the future"),
  dateOfAdoption: yup
    .date()
    .optional()
    .max(new Date(), "Date of Adoption cannot be in the future")
    .when("dateOfBirth", (schema) => {
      yup.ref.dateOfBirth != undefined &&
        schema.max(dateOfBirth, "Date of Adoption cannot be before Date of Birth");
    }),
  gender: yup.string().oneOf(["Unknown", "Male", "Female"]).default("Unknown"),
  species: yup.string().optional(),
  breed: yup.string().optional(),
  color: yup.string().optional(),
  weight: yup.number().optional(),
  weightUnit: yup.string().optional().oneOf(["kg", "lb"]),
  height: yup.number().optional(),
  heightUnit: yup.string().optional().oneOf(["cm", "in"]),
  ifFriendly: yup.boolean().optional(),
  isVeryFriendly: yup.boolean().optional(),
  isAggressive: yup.boolean().optional(),
  isVeryAggressive: yup.boolean().optional(),
  notes: yup.string().optional(),
});
