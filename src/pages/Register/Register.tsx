import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { signup } from "../../api/firebase/authentication";
import Loader from "../../components/common/Loader/Loader";
import LoginButtonGroup from "../../components/common/LoginButtonGroup/LoginButtonGroup";
import useGetToken from "../../hooks/useGetToken";
import logo from "../../assets/img/logo.png";
import { useLoading } from "../../provider/LoaderProvider";
function Register() {
  const [showButtonGroup, setShowButtonGroup] = useState("");
  const { handleSubmit, register, errors } = useForm();
  const { showLoader, hideLoader } = useLoading();

  const getToken = useGetToken();

  const onSubmit = async (data: { email: string; password: string }) => {
    showLoader();
    let result = await signup(data.email, data.password);
    await getToken(result);
    hideLoader();
  };
  return (
    <div className="w-screen h-screen bg-blue-300 flex justify-center items-center">
      <div className="bg-white h-full sm:h-auto p-8 w-full sm:w-96 rounded shadow-md flex justify-center flex-col">
        <img src={logo} className="h-10 object-contain"></img>
        <h1 className="font-bold text-gray-500 text-center py-5">
          Sign up for your account
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="border-gray-300 border-solid border-2 bg-gray-100 text-gray-500 p-2 w-full outline-none focus: border-solid focus:border-blue-500 focus:border-2"
            placeholder="Enter email"
            name="email"
            onChange={(e) =>
              setShowButtonGroup((e.target as HTMLInputElement).value)
            }
            ref={register({
              required: true,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            })}
            type="email"
          ></input>
          <input
            className="border-gray-300 border-solid border-2 bg-gray-100 text-gray-500 p-2 w-full outline-none focus: border-solid focus:border-blue-500 focus:border-2"
            placeholder="Enter password"
            name="password"
            onChange={(e) =>
              setShowButtonGroup((e.target as HTMLInputElement).value)
            }
            ref={register({
              required: true,
            })}
            type="password"
          ></input>
          <p className="text-xs text-gray-500 font-light">
            By signing up, you confirm that you've read and accepted our
            <span className="font-semibold mx-1">Terms</span>
            of Service and
            <span className="font-semibold mx-1">Privacy Policy</span>.
          </p>
          <button
            className={`font-semibold w-full p-2 rounded  focus:outline-none ${
              errors.email || showButtonGroup.trim().length == 0
                ? "bg-gray-200 text-gray-400"
                : "bg-blue-500 text-white hover:bg-blue-400"
            }`}
            type="submit"
          >
            Sign up
          </button>
        </form>
        {showButtonGroup.trim().length === 0 ? (
          <>
            <h1 className="text-center font-light text-sm py-4">OR</h1>
            <div className="pb-4">
              <LoginButtonGroup></LoginButtonGroup>
            </div>
          </>
        ) : null}
        <hr className="border-solid border-gray-300 my-3"></hr>
        <h1 className="text-center text-gray-500 text-sm">
          Already have account ?{" "}
          <Link to="/" className="text-blue-500 font-semibold">
            Login now
          </Link>
        </h1>
      </div>
    </div>
  );
}

export default Register;
