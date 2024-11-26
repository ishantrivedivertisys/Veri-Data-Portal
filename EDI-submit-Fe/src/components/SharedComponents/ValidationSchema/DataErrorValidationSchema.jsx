/*React-based Libraries */
import * as Yup from "yup";

//Reg-Ex Constants
const passwordRegex = /^(?!.*\s)(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).*$/;
const phoneNumberRegex = /^[1-9]\d{9}$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z.-]+\.[A-Z]{2,}$/i;
const onlyDigits = /^\d+$/;
const nameRegex = /^[a-zA-ZÀ-ÿ-.' ]*$/;

export const DataErrorValidationSchema = Yup.object().shape({
  id: Yup.string(),
  customerRefNo: Yup.string(),
  customerNo: Yup.string(),
  //   accountName1: Yup.string(),
  //   accountName2: Yup.string(),
  address1: Yup.string(),
  address2: Yup.string(),
  city: Yup.string(),
  zipCode: Yup.string(),
  //   stateCode: Yup.string(),
  //   countryCode: Yup.string(),
  phone: Yup.string(),
  figureDate: Yup.date(),
  lastSaleDate: Yup.date(),
  yearAccountOpened: Yup.string(),
  term1: Yup.string(),
  term2: Yup.string(),
  open_term1: Yup.string(),
  open_term2: Yup.string(),
  highCredit: Yup.string(),
  totalOwing: Yup.string(),
  current: Yup.string(),
  dating: Yup.string(),
  aging1_30: Yup.string(),
  aging31_60: Yup.string(),
  aging61_90: Yup.string(),
  agingOver90: Yup.string(),
  dispute1_30: Yup.string(),
  dispute31_60: Yup.string(),
  dispute61_90: Yup.string(),
  disputeOver90: Yup.string(),
  averageDays: Yup.string(),
  mannerOfPayment: Yup.string(),
  contact: Yup.string(),
  contactJobTitle: Yup.string(),
  contactTelephone: Yup.string(),
  contactEmail: Yup.string()
    .trim()
    .matches(emailRegex, "Please enter a valid email.")
    // .required("Email is required")
    .test(
      "valid-email",
      "Invalid email format",
      (value) =>
        value?.split("@").length === 2 &&
        value?.split("@")[1]?.split(".").length === 2
    ),
  commentCode: Yup.string(),
  comments: Yup.string(),
});
