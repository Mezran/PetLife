import * as yup from "yup";
import mongoose from "mongoose";

export const petCreateValidationSchema = yup.object().shape({
  refUser_id: yup
    .string()
    .required()
    .test("is-valid-object-id", "${path} is not a valid ObjectId", (value) => {
      return mongoose.Types.ObjectId.isValid(value);
    }),
  name: yup.string().required(),
});

export const petGetAllValidationSchema = yup.object().shape({
  refUser_id: yup
    .string()
    .required()
    .test("is-valid-object-id", "${path} is not a valid ObjectId", (value) => {
      return mongoose.Types.ObjectId.isValid(value);
    }),
});

export const petGetOneValidationSchema = yup.object().shape({
  // refUser_id is a mongoose ObjectId
  refUser_id: yup
    .string()
    .required()
    .test("is-valid-object-id", "${path} is not a valid ObjectId", (value) => {
      return mongoose.Types.ObjectId.isValid(value);
    }),
  // pet_id is a mongoose ObjectId
  pet_id: yup
    .string()
    .required()
    .test("is-valid-object-id", "${path} is not a valid ObjectId", (value) => {
      return mongoose.Types.ObjectId.isValid(value);
    }),
});

export const petUpdateSchema = yup.object().shape({
  refUser_id: yup
    .string()
    .required()
    .test("is-valid-object-id", "${path} is not a valid ObjectId", (value) => {
      return mongoose.Types.ObjectId.isValid(value);
    }),
  pet_id: yup
    .string()
    .required()
    .test("is-valid-object-id", "${path} is not a valid ObjectId", (value) => {
      return mongoose.Types.ObjectId.isValid(value);
    }),
  name: yup.string().optional(),
});
