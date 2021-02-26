import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import userReducer from "./reducers/user";
import boardReducer from "./reducers/board";
import usersReducer from "./reducers/users";
import taskReducer from "./reducers/task";
import { StateTypes } from "./types";
// Thanks to: https://stackoverflow.com/a/52161383/14480038
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (e) {
    // Ignore write errors;
  }
};

const peristedState = loadState();

const rootReducer = combineReducers({
  user: userReducer,
  boards: boardReducer,
  users: usersReducer,
  task: taskReducer,
});
const store = createStore(rootReducer, peristedState, applyMiddleware(thunk));

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
