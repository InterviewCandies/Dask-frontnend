import { list } from "postcss";
import { AUTH_TOKEN, List, Message } from "../../types";
import axios from "../../utils/axios";
import { errorHandler } from "../../utils/errorHandler";

axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem(AUTH_TOKEN);

export const createList = async (data: List): Promise<Message> => {
  try {
    const result = await axios.post("/lists/create", data);
    return { data: result.data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const updateList = async (data: List): Promise<Message> => {
  try {
    const result = await axios.post("/lists/update", data);
    return { data: result.data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const deleteList = async (data: List): Promise<Message> => {
  try {
    // NEED TO DELETE ALL TASKS IN THIS LSIT BEFORE REMOVING IT !!!!!

    const result = await axios.get("/lists/delete/" + data._id);
    return { data: result.data };
  } catch (error) {
    return errorHandler(error);
  }
};
