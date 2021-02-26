import axios from "../../utils/axios";
import { AUTH_TOKEN, Board, Message } from "../../types";
import { errorHandler } from "../../utils/errorHandler";
import { updateBoards } from "../../actions/board";
import { Dispatch } from "redux";

axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem(AUTH_TOKEN);
export const createBoard = async (data: Board): Promise<Message> => {
  try {
    const result = await axios.post("/boards/create", data);
    return { data: result.data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const updateBoard = async (data: Board): Promise<Message> => {
  try {
    const result = await axios.post("/boards/update", data);
    return { data: result.data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const deleteBoard = async (id: string): Promise<Message> => {
  try {
    const result = await axios.get("/boards/delete/" + id);
    return { data: result.data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const fetchBoardsByEmail = (email: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const result = await axios.get(`/boards?user=${email}`);
      const data = await result.data;
      dispatch(updateBoards(data));
      return data;
    } catch (error) {
      throw error;
    }
  };
};
