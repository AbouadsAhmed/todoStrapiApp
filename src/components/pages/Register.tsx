import Button from "../ui/Button";
import Input from "../ui/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import InputErrorMsg from "../ui/InputErrorMsg";
import { REGISTER_FORM } from "../../data";
import { yupResolver } from "@hookform/resolvers/yup";
import { REGISTER_schema } from "../../validation";
import AxiosInstance from "../../config/Config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import { IAxiosErrorMsg } from "../../interfaces";
import { useNavigate } from "react-router-dom";
interface IFormInput {
  username: string;
  email: string;
  password: string;
}
const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(REGISTER_schema),
  });
  // handler
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    //paning
    setIsLoading(true);
    try {
      //fullfiled
      const { status } = await AxiosInstance.post("/auth/local/register", data);
      if (status === 200) {
        toast.success(
          "you will navigate to login page after 2 seconds to login!",
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
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      // rejected
      const errorObj = error as AxiosError<IAxiosErrorMsg>;
      toast.error(`${errorObj.response?.data?.error?.message}`, {
        position: "bottom-center",
        duration: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };
  console.log(errors);
  // render
  const registerInput = REGISTER_FORM.map(
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
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Register to access
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {registerInput}
        <Button fullWidth isLoading={isLoading}>
          Register
        </Button>
      </form>
    </div>
  );
};

export default Register;
