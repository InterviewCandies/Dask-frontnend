import { useSnackbar } from "notistack";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentTask } from "../actions/task";
import { updateTask } from "../api/task/task";
import TaskDetails from "../container/TaskDetails/TaskDetails";
import { List, Message, StateTypes, Task } from "../types";
import useUpdateBoard from "./useUpdateBoard";

function useUpdateCurrentTask() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { saveChangesToBoard } = useUpdateBoard();
  const url = window.location.pathname;
  const id: string = url.substring(url.lastIndexOf("/") + 1);
  const boards = useSelector((state: StateTypes) => state.boards);
  const board = boards?.find((board) => board._id === id);

  const updateReduxTask = useCallback(
    (task: Task) => {
      dispatch(updateCurrentTask({ ...task }));
    },
    [dispatch]
  );

  const saveChangesToCurrentTask = async (
    newTask: Task,
    successMessage?: string
  ): Promise<Message> => {
    let result = await updateTask(newTask);

    if (result.status) {
      enqueueSnackbar(result.message, { variant: "error" });
      return result;
    }

    const listIndex = (board?.lists as List[]).findIndex(
      (list) =>
        (list.tasks as Task[]).findIndex((task) => task._id == newTask._id) >= 0
    );
    if (!board?.lists) return {};
    const taskIndex = board?.lists[listIndex].tasks.findIndex(
      (task) => task._id === newTask._id
    );
    board.lists[listIndex].tasks[taskIndex] = { ...newTask };
    result = await saveChangesToBoard({ ...board }, successMessage);
    updateReduxTask(newTask);
    return result;
  };
  return { saveChangesToCurrentTask, updateReduxTask };
}

export default useUpdateCurrentTask;
