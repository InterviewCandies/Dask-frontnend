import { ActionTypes, Task, UPDATE_CURRENT_TASK } from "../types";

export const updateCurrentTask = (task: Task): ActionTypes => {
  return {
    type: UPDATE_CURRENT_TASK,
    payload: task,
  };
};
