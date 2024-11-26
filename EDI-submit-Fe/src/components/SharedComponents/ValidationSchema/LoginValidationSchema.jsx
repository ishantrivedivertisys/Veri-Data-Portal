import * as Yup from "yup";

//Reg-Ex Constants
const passwordRegex = /^(?!.*\s)(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).*$/;
const phoneNumberRegex = /^[1-9]\d{9}$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z.-]+\.[A-Z]{2,}$/i;
const onlyDigits = /^\d+$/;
const nameRegex = /^[a-zA-ZÀ-ÿ-.' ]*$/;

export const LoginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required").min(8).max(20),
});
