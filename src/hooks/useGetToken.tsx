import { verify } from "../utils/decodeToken";
import { useSnackbar } from "notistack";
import { Dispatch, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { authenticateUser } from "../actions/user";
import { createUser } from "../api/user";
import { AUTH_TOKEN, CURRENT_USER, Message, User } from "../types";
import instance from "../utils/axios";
export default function useGetToken() {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const dispatch: Dispatch<any> = useDispatch();

  const updateUser = useCallback(
    (data: User) => dispatch(authenticateUser(data)),
    [dispatch]
  );

  return async (result: Message) => {
    if (result.status) {
      enqueueSnackbar(result.message, { variant: "error" });
      return;
    }
    result = await createUser(result.data);
    if (result.status) {
      enqueueSnackbar(result.message, { variant: "error" });
      return;
    }
    const user = verify(result.data);
    if (user.status) {
      enqueueSnackbar(user.message, { variant: "error" });
      return;
    }
    updateUser(user.data);
    localStorage.setItem(AUTH_TOKEN, result.data);
    instance.defaults.headers.common["Authorization"] = "Bearer " + result.data;

    history.push("/all");
  };
}
