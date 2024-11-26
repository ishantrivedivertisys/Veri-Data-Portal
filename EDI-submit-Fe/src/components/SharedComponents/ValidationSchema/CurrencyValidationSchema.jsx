/*React-based Libraries */
import * as Yup from "yup";

// Validation Schema
export const currencyExchangeValidationSchema = Yup.object().shape({
  wefDate: Yup.string().required("Effective date is required"),
  currency: Yup.string().required("Currency is required"),
  dollar: Yup.number()
    .required("USD amount is required")
    .positive("Must be a positive number"),
});
