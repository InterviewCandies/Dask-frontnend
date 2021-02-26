import { useSnackbar } from "notistack";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { createTask } from "../../api/task/task";
import Loader from "../../components/common/Loader/Loader";
import useUpdateBoard from "../../hooks/useUpdateBoard";
import { useDialog } from "../../provider/DialogProvider";
import { useLoading } from "../../provider/LoaderProvider";
import { Board, List } from "../../types";

function NewCard({ board, list }: { board: Board; list: List }) {
  const { register, handleSubmit } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [, closeDialog] = useDialog();
  const { saveChangesToBoard } = useUpdateBoard();
  const { showLoader, hideLoader } = useLoading();

  const onSubmit = async (data: { title: string; description: string }) => {
    let { title, description } = data;
    title = title.trim() || "Untitled";
    description = description.trim() || "No description";

    showLoader();

    let result = await createTask({ title, description });
    if (result.status) {
      enqueueSnackbar(result.message, { variant: "error" });
      hideLoader();
      return;
    }
    const inx = board.lists?.findIndex((item) => item._id == list._id);
    const newLists = (board.lists as List[]).filter(
      (item) => item._id !== list._id
    );
    newLists.splice(inx as number, 0, {
      ...list,
      tasks: [...list.tasks, { ...result.data }],
    });

    result = await saveChangesToBoard(
      {
        ...board,
        lists: [...newLists],
      },
      `A new card has been added to ${list.title}`
    );
    if (!result.status) {
      enqueueSnackbar("New task is added", { variant: "success" });
      closeDialog();
    }
    hideLoader();
  };

  return (
    <div>
      <form
        className="bg-white p-5 flex flex-col space-y-5 pt-7 w-80 relative"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="font-bold text-center text-lg uppercase">new task</h1>
        <input
          className="rounded focus:ring-blue-500 ring-2 ring-gray-300 p-2 bg-gray-200 focus:outline-none"
          placeholder="Add card title"
          name="title"
          ref={register}
        ></input>
        <input
          className="rounded focus:ring-blue-500 ring-2 ring-gray-300  bg-gray-200 p-2 focus:outline-none h-20"
          placeholder="Add card description"
          name="description"
          ref={register}
        ></input>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="py-2 px-3 hover:bg-gray-200 focus:outline-none rounded-lg font-semibold"
            onClick={closeDialog}
          >
            Cancel
          </button>
          <button
            className="py-2 px-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg focus:outline-none font-semibold"
            type="submit"
          >
            <i className="fas fa-plus"></i> Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewCard;
