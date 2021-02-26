import { AUTH_TOKEN, CommentType, Message } from "../../types";
import axios from "../../utils/axios";
import { errorHandler } from "../../utils/errorHandler";

axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem(AUTH_TOKEN);

export const createComment = async (comment: CommentType): Promise<Message> => {
  try {
    const result = await axios.post("/comments/create", comment);
    return { data: result.data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const updateComment = async (comment: CommentType): Promise<Message> => {
  try {
    const result = await axios.post("/comments/update", comment);
    return { data: result.data };
  } catch (error) {
    return errorHandler(error);
  }
};

export const deleteComment = async (id: string): Promise<Message> => {
  try {
    const result = await axios.get("/comments/delete/" + id);
    return { data: result.data };
  } catch (error) {
    return errorHandler(error);
  }
};
