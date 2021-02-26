import { ActionTypes, List, UPDATE_LISTS, ADD_TO_LISTS } from "../types";

export const updateLists = (lists: List[]): ActionTypes => {
  return {
    type: UPDATE_LISTS,
    payload: lists,
  };
};

export const addToLists = (list: List): ActionTypes => {
  return {
    type: ADD_TO_LISTS,
    payload: list,
  };
};
