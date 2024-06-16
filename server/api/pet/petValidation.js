import * as yup from "yup";

export const petCreateSchema = yup.object().shape({
  refUser_id: yup.string().required(),
  name: yup.string().required(),
});
