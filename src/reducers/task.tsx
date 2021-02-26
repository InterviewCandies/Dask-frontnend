import { ActionTypes, Task, UPDATE_CURRENT_TASK } from "../types";

const initialState: Task = { title: "" };

const reducer = (state = initialState, action: ActionTypes): Task => {
  switch (action.type) {
    case UPDATE_CURRENT_TASK:
      return { ...action.payload };
  }
  return state;
};

export default reducer;
