import { useSnackbar } from "notistack";
import React from "react";
import {
  signInWithGithub,
  signInWithGoogle,
} from "../../../api/firebase/authentication";
import GithubIcon from "../../../assets/img/github.svg";
import GoogleIcon from "../../../assets/img/google.svg";
import useGetToken from "../../../hooks/useGetToken";
import { Message } from "../../../types";

const Button = (props: {
  children: JSX.Element | string;
  icon: string | any;
  onClick: Function;
}) => {
  return (
    <div>
      <button
        className="w-full shadow-md rounded text-gray-500 font-semibold p-2 flex items-center justify-center hover:bg-gray-200 focus:outline-none"
        onClick={() => props.onClick()}
      >
        <img src={props.icon} className="w-4 h-4 mr-3"></img> {props.children}
      </button>
    </div>
  );
};

function LoginButtonGroup() {
  const getToken = useGetToken();

  const continueWithGoogle = async () => {
    const result = await signInWithGoogle();
    await getToken(result);
  };

  const continueWithGithub = async () => {
    const result = await signInWithGithub();
    await getToken(result);
  };

  return (
    <div className="space-y-4">
      <Button icon={GoogleIcon} onClick={continueWithGoogle}>
        Continue with Google
      </Button>
      <Button icon={GithubIcon} onClick={continueWithGithub}>
        Continue with Github
      </Button>
    </div>
  );
}

export default LoginButtonGroup;
