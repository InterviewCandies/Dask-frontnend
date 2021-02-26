import { Message } from "../types";

export const errorHandler = (error: any): Message => {
  if (error.response)
    return {
      status: error.response.status,
      message: error.response.data.message,
    };
  if (error.request)
    return {
      status: "500",
      message: "Cannot reach server. Please check your internet connection.",
    };
  return {
    status: "500",
    message: error.message,
  };
};
