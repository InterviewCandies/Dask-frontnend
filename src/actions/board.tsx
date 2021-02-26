import axios from "axios";
import {
  ActionTypes,
  ADD_BOARD,
  Board,
  GET_BOARDS_BY_USER,
  UPDATE_BOARDS,
  User,
} from "../types";

export const getBoardsByUser = (user: User): ActionTypes => {
  return {
    type: GET_BOARDS_BY_USER,
    payload: user,
  };
};

export const updateBoards = (boards: Board[]): ActionTypes => {
  return {
    type: UPDATE_BOARDS,
    payload: boards,
  };
};

export const addBoard = (board: Board): ActionTypes => {
  return {
    type: ADD_BOARD,
    payload: board,
  };
};
