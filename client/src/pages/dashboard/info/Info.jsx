// imports
import React from "react";

// Material UI
// React Router Dom
// Redux
import { useSelector } from "react-redux";
// React Hook Form, yup, resolver, and devtool
// components

// const FileName
const Info = () => {
  // local state
  // React Router Dom
  // Redux
  const selectedPet_id = useSelector((state) => state.pet.selectedPet_id);
  // React Hook Form
  // - schema
  // - defaultValues
  // - const {} = useForm;
  // onXXSubmit
  // return () {}
  return <div>{selectedPet_id ? selectedPet_id : "New Pet"}</div>;
};

// export default
export default Info;
