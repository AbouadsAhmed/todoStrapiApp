import { IInput, ILogin } from "../interfaces";

export const REGISTER_FORM: IInput[] = [
  {
    placeholder: "username",
    name: "username",
    validation: {
      required: true,
      minLength: 5,
    },
    type: "text",
  },
  {
    placeholder: "email",
    name: "email",
    validation: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    type: "email",
  },
  {
    placeholder: "password",
    name: "password",
    validation: {
      required: true,
      minLength: 5,
    },
    type: "password",
  },
];
export const LOGIN_FORM: ILogin[] = [
  {
    placeholder: "email",
    name: "identifier",
    validation: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    type: "email",
  },
  {
    placeholder: "password",
    name: "password",
    validation: {
      required: true,
      minLength: 5,
    },
    type: "password",
  },
];
