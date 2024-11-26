import * as Yup from "yup";

export const AddAccountValidationSchema = Yup.object().shape({
  name_1: Yup.string().required("Name 1 is required"),
  city: Yup.string().required("City is required"),
  // country: Yup.string().required("Country is required"),
});
