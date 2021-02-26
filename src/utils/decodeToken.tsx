import jwt from "jsonwebtoken";
import { Message, User } from "../types";
import { errorHandler } from "./errorHandler";
import config from "../config.json";
export const verify = (token: string): Message => {
  try {
    const decoded = jwt.verify(token, config.secret);
    return { data: (decoded as { user: User }).user };
  } catch (error) {
    return errorHandler(error);
  }
};
