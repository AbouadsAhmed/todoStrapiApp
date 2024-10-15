import * as yup from "yup";
export const REGISTER_schema = yup
  .object({
    username: yup
      .string()
      .required("username is required")
      .min(5, "username should be at laest 5 chartacter"),
    email: yup
      .string()
      .required("email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "not a valid email"),
    password: yup
      .string()
      .required("password should be at laest 5 chartacter")
      .min(5, "password should be at laest 5 chartacter"),
  })
  .required();
export const LOGIN_schema = yup
  .object({
    identifier: yup
      .string()
      .required("email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "not a valid email"),
    password: yup
      .string()
      .required("password should be at laest 5 chartacter")
      .min(5, "password should be at laest 5 chartacter"),
  })
  .required();
export const INPUT_schema = yup
  .object({
    title: yup.string().required("username is required"),
    description: yup.string().required("username is required"),
  })
  .required();
