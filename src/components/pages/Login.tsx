import { useState } from "react";
import { LOGIN_FORM } from "../../data";
import Button from "../ui/Button";
import Input from "../ui/Input";
import InputErrorMsg from "../ui/InputErrorMsg";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LOGIN_schema } from "../../validation";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IAxiosErrorMsg } from "../../interfaces";
import AxiosInstance from "../../config/Config";
interface IFormInput {
  identifier: string;
  password: string;
}
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(LOGIN_schema),
  });
  // handler
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    //paning
    setIsLoading(true);
    try {
      //fullfiled
      const { status, data: userData } = await AxiosInstance.post(
        "/auth/local",
        data
      );
      if (status === 200) {
        toast.success(
          "you will navigate to home page after 2 seconds to todo!",
          {
            position: "bottom-center",
            duration: 1500,
            style: {
              backgroundColor: "black",
              color: "white",
              width: "fit-content",
            },
          }
        );
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        setTimeout(() => {
          location.replace("/");
        }, 2000);
      }
    } catch (error) {
      // rejected
      const errorObj = error as AxiosError<IAxiosErrorMsg>;
      toast.error(`${errorObj.response?.data?.error?.message}`, {
        position: "bottom-center",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  console.log(errors);
  // render
  const login_Input = LOGIN_FORM.map(
    ({ placeholder, validation, name, type }, idx) => {
      return (
        <div key={idx}>
          <Input
            type={type}
            placeholder={placeholder}
            {...register(name, validation)}
          />
          {errors[name] && <InputErrorMsg msg={errors[name]?.message} />}
        </div>
      );
    }
  );
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl  font-semibold">
        Login to access
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {login_Input}
        <Button fullWidth isLoading={isLoading}>
          lOGIN
        </Button>
      </form>
    </div>
  );
};

export default Login;
