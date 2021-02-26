import { ActionTypes, List, UPDATE_LISTS } from "../types";

const initialState: List[] = [];
const reducer = (state = initialState, action: ActionTypes): List[] => {
  switch (action.type) {
    case UPDATE_LISTS:
      return [...action.payload];
  }
  return state;
};

export default reducer;
