import axios from "../../utils/axios";
import { AUTH_TOKEN, User } from "../../types";
import { Message } from "../../types";
import { errorHandler } from "../../utils/errorHandler";
import { Dispatch } from "redux";
import { updateUsers } from "../../actions/user";
axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem(AUTH_TOKEN);

export const createUser = async (data: User): Promise<Message> => {
  try {
    const result = await axios.post("/users/create", data);
    return { data: result.data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const fetchUsers = () => {
  return async (dispatch: Dispatch) => {
    try {
      const result = await axios.get("/users");
      dispatch(updateUsers(result.data));
      return result;
    } catch (error) {
      throw error;
    }
  };
};
