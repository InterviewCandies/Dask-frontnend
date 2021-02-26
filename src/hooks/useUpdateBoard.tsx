import { useSnackbar } from "notistack";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBoards } from "../actions/board";
import { updateBoard } from "../api/board";
import { Board, StateTypes } from "../types";

function useUpdateBoard() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const boards = useSelector((state: StateTypes) => state.boards);

  const updateState = useCallback(
    (board: Board[]) => {
      dispatch(updateBoards(board));
    },
    [dispatch]
  );

  const saveChangesToBoard = async (board: Board, succeedMessage?: string) => {
    const result = await updateBoard({
      ...board,
    });
    if (result.status) {
      enqueueSnackbar(result.message, { variant: "error" });
      return result;
    } else
      succeedMessage &&
        enqueueSnackbar(succeedMessage, {
          variant: "success",
        });
    let newBoards = boards.filter((item) => item._id !== board._id);
    updateState([...newBoards, { ...board }]);
    return result;
  };

  return { saveChangesToBoard };
}

export default useUpdateBoard;
