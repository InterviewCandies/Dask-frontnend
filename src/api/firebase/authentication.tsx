import { auth, GithubProvider, GoogleProvider } from "./firebase";
import { Message } from "../../types";

export const login = async (
  email: string,
  password: string
): Promise<Message> => {
  try {
    const result = await auth().signInWithEmailAndPassword(email, password);
    return { data: result.user };
  } catch (error) {
    return { status: error.code, message: error.message };
  }
};

export const signup = async (
  email: string,
  password: string
): Promise<Message> => {
  try {
    const result = await auth().createUserWithEmailAndPassword(email, password);
    return { data: result.user };
  } catch (error) {
    return { status: error.code, message: error.message };
  }
};

export const signInWithGoogle = async (): Promise<Message> => {
  try {
    const result = await auth().signInWithPopup(GoogleProvider);
    return { data: result.user };
  } catch (error) {
    return {
      status: error.code,
      message: error.message,
    };
  }
};

export const signInWithGithub = async (): Promise<Message> => {
  try {
    const result = await auth().signInWithPopup(GithubProvider);
    return { data: result.user };
  } catch (error) {
    return {
      status: error.code,
      message: error.message,
    };
  }
};
