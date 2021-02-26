import axios from "axios";
import { Dispatch } from "redux";
import { ActionTypes, AUTHENTICATE_USER, UPDATE_USERS, User } from "../types";
import { errorHandler } from "../utils/errorHandler";

export const authenticateUser = (user: User): ActionTypes => {
  return {
    type: AUTHENTICATE_USER,
    payload: user,
  };
};

export const updateUsers = (users: User[]): ActionTypes => {
  return {
    type: UPDATE_USERS,
    payload: users,
  };
};
