import { ActionTypes, Board } from "../types";

const initialState: Board[] = [];
const reducer = (state = initialState, action: ActionTypes): Board[] => {
  switch (action.type) {
    case "ADD_BOARD":
      return [...state, action.payload];
    case "UPDATE_BOARDS":
      return [...action.payload];
  }
  return state;
};

export default reducer;
