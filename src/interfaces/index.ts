export interface IInput {
  name: "username" | "email" | "password";
  placeholder: string;
  type: string;
  validation: {
    required: boolean;
    minLength?: number;
    pattern?: RegExp;
  };
}
export interface ILogin {
  name: "identifier" | "password";
  placeholder: string;
  type: string;
  validation: {
    required: boolean;
    minLength?: number;
    pattern?: RegExp;
  };
}
export interface IAxiosErrorMsg {
  error: {
    message?: string;
  };
}

export interface ItoDo {
  id: number;
  title: string;
  description?: string;
}
