import { Dispatch } from "redux";
import { updateCurrentTask } from "../../actions/task";
import { AUTH_TOKEN, Message, Task } from "../../types";
import axios from "../../utils/axios";
import { errorHandler } from "../../utils/errorHandler";
axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem(AUTH_TOKEN);

export const createTask = async (data: Task): Promise<Message> => {
  try {
    const result = await axios.post("/tasks/create", { ...data });
    return { data: result.data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const updateTask = async (data: Task): Promise<Message> => {
  try {
    const result = await axios.post("/tasks/update", { ...data });
    return { data: result.data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const deleteTask = async (id: string): Promise<Message> => {
  try {
    const result = await axios.get("/tasks/delete/" + id);
    return {
      data: result.data,
    };
  } catch (error) {
    return errorHandler(error);
  }
};

export const fetchTask = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const result = await axios.get("/tasks/" + id);
      dispatch(updateCurrentTask(result.data));
      return result.data;
    } catch (error) {
      throw error;
    }
  };
};
