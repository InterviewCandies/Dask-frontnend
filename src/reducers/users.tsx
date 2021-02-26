import { ActionTypes, UPDATE_USERS, User } from "../types";

const initialState: User[] = [];

const reducer = (state = initialState, action: ActionTypes): User[] => {
  switch (action.type) {
    case UPDATE_USERS:
      return [...action.payload];
  }
  return state;
};

export default reducer;
