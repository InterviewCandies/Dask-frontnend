import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../../api/comment/comment";
import { deleteTask, fetchTask } from "../../api/task/task";
import Assignment from "../../components/Assignment/Assignment";
import CustomImage from "../../components/common/CustomImage/CustomImage";
import GrayButton from "../../components/common/GrayButton/GrayButton";
import CoverImageMenu from "../../components/CoverImageMenu/CoverImageMenu";
import CustomPopover from "../../components/CustomPopover/CustomPopover";
import LabelGenerator from "../../components/LabelGenerator/LabelGenerator";
import useUpdateBoard from "../../hooks/useUpdateBoard";
import useUpdateCurrentTask from "../../hooks/useUpdateCurrentTask";
import { useDialog } from "../../provider/DialogProvider";
import { useLoading } from "../../provider/LoaderProvider";
import {
  Board,
  CommentType,
  CURRENT_USER,
  DEFAULT_AVATAR,
  List,
  StateTypes,
  Task,
  TASK_COVER,
} from "../../types";
import { errorHandler } from "../../utils/errorHandler";
import { formatDate } from "../../utils/formatDate";

const Comment = ({ comment }: { comment: CommentType }) => {
  const user = useSelector((state: StateTypes) => state.user);
  const currentTask = useSelector((state: StateTypes) => state.task);
  const { enqueueSnackbar } = useSnackbar();
  const { saveChangesToCurrentTask } = useUpdateCurrentTask();
  const [edit, setEdit] = useState(false);
  const contentRef = useRef(null);

  const handleDeleteComment = async (id: string) => {
    let result = await deleteComment(id);
    if (result.status) {
      enqueueSnackbar(result.message, { variant: "error" });
      return;
    }
    const comments = currentTask.comments?.filter(
      (comment) => comment._id !== id
    );
    result = await saveChangesToCurrentTask(
      {
        ...currentTask,
        comments: [...(comments as [])],
      },
      "Comment is added"
    );
  };

  const handleEditComment = async () => {
    const text = (contentRef.current as any)?.value;
    if (!text.trim().length) return;

    let result = await updateComment(comment);
    if (result.status) {
      enqueueSnackbar(result.message, { variant: "error" });
      return;
    }

    const inx = currentTask.comments?.findIndex(
      (item) => item._id === comment._id
    );

    if (currentTask.comments)
      currentTask.comments[inx as number].content = text;

    result = await saveChangesToCurrentTask({
      ...currentTask,
    });
    setEdit(false);
  };
  return (
    <div
      v-for="item in items"
      className="space-y-2 border-gray-200 border-t-2  py-5"
    >
      <div className="flex flex-col space-y-1 md:space-y-0  md:flex-row justify-between">
        <div className="flex items-center space-x-2">
          <CustomImage
            className="w-9 h-9 rounded-lg"
            src={comment.author.photoURL || DEFAULT_AVATAR}
          ></CustomImage>
          <div>
            <h1 className="text-sm font-bold">{comment.author.email}</h1>
            <p className="text-xs text-gray-600">
              {comment.createdDate && formatDate(comment.createdDate)}
            </p>
          </div>
        </div>
        {user.email == comment.author.email && (
          <div className="flex space-x-2">
            {!edit ? (
              <button
                className="text-gray-500 text-xs hover:bg-gray-100 focus:outline-none py-1 p-2 rounded-lg"
                onClick={() => setEdit(true)}
              >
                Edit
              </button>
            ) : (
              <button
                className="text-green-500 text-xs hover:bg-green-100 focus:outline-none py-1 p-2 rounded-lg"
                onClick={handleEditComment}
              >
                Save
              </button>
            )}
            <button
              className="text-gray-500 text-xs hover:bg-gray-100 focus:outline-none py-1 p-2 rounded-lg"
              onClick={() => handleDeleteComment(comment._id as string)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <div>
        {edit ? (
          <textarea
            rows={5}
            ref={contentRef}
            defaultValue={comment.content}
            className="p-2 w-full border-2 border-gray-200 rounded-lg focus:border-blue-300 focus:outline-none"
          ></textarea>
        ) : (
          <p className="">{comment.content}</p>
        )}
      </div>
    </div>
  );
};

const Comments = ({ comments }: { comments: CommentType[] }) => {
  const { register, handleSubmit } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const { saveChangesToCurrentTask } = useUpdateCurrentTask();
  const contentRef = useRef<null | HTMLTextAreaElement>(null);
  const user = useSelector((state: StateTypes) => state.user);
  const currentTask = useSelector((state: StateTypes) => state.task);
  const { showLoader, hideLoader } = useLoading();

  const handleCreateComment = async (data: CommentType) => {
    const newComment = {
      content: data.content,
      author: { ...user },
    };
    showLoader();
    let result = await createComment({ ...newComment });
    if (result.status) {
      enqueueSnackbar(result.message, { variant: "error" });
      hideLoader();
      return;
    }
    result = await saveChangesToCurrentTask(
      {
        ...currentTask,
        comments: [{ ...result.data }, ...(currentTask.comments as [])],
      },
      "Comment is added"
    );
    if (!result.status && contentRef.current) contentRef.current.value = "";
    hideLoader();
  };
  return (
    <div>
      <form
        className="p-4 border-2 border-gray-300 shadow rounded-xl"
        onSubmit={handleSubmit(handleCreateComment)}
      >
        <div className=" flex space-x-2 ">
          <CustomImage
            className="w-9 h-9"
            src={user.photoURL as string}
          ></CustomImage>
          <textarea
            ref={(e) => {
              register(e, { required: true });
              contentRef.current = e;
            }}
            name="content"
            className="w-full focus:outline-none"
            placeholder="Write a comment"
            rows={4}
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button className=" focus:outline-none bg-blue-500 px-3 py-2 text-white rounded-xl">
            <i className="fas fa-paper-plane"></i> Send
          </button>
        </div>
      </form>
      <div>
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment}></Comment>
        ))}
      </div>
    </div>
  );
};

function TaskDetails({ taskId }: { taskId: string }) {
  const descriptionRef = useRef(null);
  const titleRef = useRef(null);
  const [edit, setEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [, closeDialog] = useDialog();
  const currentTask: Task = useSelector((state: StateTypes) => state.task);
  const { saveChangesToCurrentTask } = useUpdateCurrentTask();
  const { saveChangesToBoard } = useUpdateBoard();
  const labelRef = useRef(null);
  const assignmentRef = useRef(null);
  const coverRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const { showLoader, hideLoader } = useLoading();

  const url = window.location.hash;
  const id: string = url.substring(url.lastIndexOf("/") + 1);
  const boards = useSelector((state: StateTypes) => state.boards);
  const board = boards?.find((board) => board._id === id);

  const dispatch: Dispatch<any> = useDispatch();
  useEffect(() => {
    const fetchCurrentTask = async () => {
      try {
        const result = await dispatch(fetchTask(taskId as string));
      } catch (error) {
        return errorHandler(error);
      }
    };
    fetchCurrentTask();
  }, []);

  const handleUpdateTitle = async () => {
    showLoader();
    const title = (titleRef.current as any).value.trim() || "Untitled";
    const newTask = { ...currentTask, title };
    const result = await saveChangesToCurrentTask(newTask);
    if (!result?.status) setEditTitle(false);
    hideLoader();
  };

  const handleDeleteTask = async () => {
    showLoader();
    let result = await deleteTask(currentTask._id as string);
    if (result.status) {
      enqueueSnackbar(result.message, { variant: "error" });
      hideLoader();
      return;
    }
    const currentList = board?.lists?.find(
      (list) =>
        list.tasks.findIndex((task) => task._id === currentTask._id) >= 0
    );
    if (currentList?.tasks)
      currentList.tasks = currentList?.tasks.filter(
        (task) => task._id !== currentTask._id
      ) as List[];
    const newLists = board?.lists?.map((list) => {
      if (currentList?._id === list._id) return currentList;
      else return list;
    }) as List[];
    result = await saveChangesToBoard(
      { ...(board as Board), lists: [...newLists] },
      `Task ${currentTask.title} is deleted`
    );
    if (result.data) closeDialog();
    hideLoader();
  };

  const handleUpdateDescription = async () => {
    showLoader();
    const description =
      (descriptionRef.current as any).value.trim() || "No description";
    const newTask = { ...currentTask, description };
    const result = await saveChangesToCurrentTask(newTask);
    if (!result?.status) setEdit(false);
    hideLoader();
  };

  return (
    <div className="p-5 w-auto">
      <button
        className=" px-3 absolute focus:outline-none top-2.5 right-2.5  py-1 rounded-lg bg-blue-500 text-white"
        onClick={closeDialog}
      >
        <i className="fas fa-times"></i>
      </button>
      {currentTask.coverURL && (
        <CustomImage
          //@ts-ignore
          src={TASK_COVER[currentTask.coverURL]}
          className="w-full h-28 rounded"
        ></CustomImage>
      )}
      <div className="py-5">
        <div className="grid md:grid-cols-4 grid-cols-1 space-y-4 md:space-y-0">
          <div className="space-y-8 mt-4 col-span-3">
            {editTitle ? (
              <div className="flex  flex-col space-y-2">
                <input
                  ref={titleRef as any}
                  className="ring-2 w-full md:w-4/5 my-2 ring-gray-200 rounded-lg  focus:outline-none"
                  style={{ padding: "0.5rem" }}
                  defaultValue={currentTask.title}
                ></input>
                <div className="flex space-x-2 mt-2">
                  <button
                    className="hover:bg-green-100 font-semibold text-green-500 px-3 py-1 rounded-xl focus:outline-none"
                    onClick={handleUpdateTitle}
                  >
                    Save
                  </button>
                  <button
                    className="px-2 py-1 rounded-xl focus:outline-none   hover:font-semibold hover:bg-gray-100"
                    onClick={() => setEditTitle(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap">
                <h1
                  className="font-bold text-xl word-breaks mr-2"
                  style={{ wordBreak: "break-word" }}
                >
                  {currentTask.title}
                </h1>
                <button
                  className="ring-1 ring-gray-300 text-xs hover:bg-gray-100 focus:outline-none text-gray-500 bg-white py-1 px-3 rounded-lg"
                  onClick={() => setEditTitle((prevState) => !prevState)}
                >
                  <i className="fas fa-edit mr-2"></i>Edit
                </button>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex space-x-3 text-xs items-center">
                <h1 className="text-xs text-gray-600 font-semibold">
                  <i className="fas fa-file-alt mr-2"></i> Description
                </h1>
                <button
                  className="ring-1 ring-gray-300  hover:bg-gray-100 focus:outline-none text-gray-500 bg-white py-1 px-3 rounded-lg"
                  onClick={() => setEdit((prevState) => !prevState)}
                >
                  <i className="fas fa-edit mr-2"></i>Edit
                </button>
              </div>
              {edit ? (
                <div>
                  <textarea
                    ref={descriptionRef as any}
                    className="ring-2 w-full md:w-4/5   ring-gray-200 rounded-lg  focus:outline-none"
                    style={{ padding: "0.5rem" }}
                    defaultValue={currentTask.description}
                  ></textarea>
                  <div className="flex space-x-2 mt-2">
                    <button
                      className="hover:bg-green-100 font-semibold text-green-500 px-3 py-1 rounded-xl focus:outline-none"
                      onClick={handleUpdateDescription}
                    >
                      Save
                    </button>
                    <button
                      className="px-2 py-1 rounded-xl focus:outline-none   hover:font-semibold hover:bg-gray-100"
                      onClick={() => setEdit(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm m-0 break-words">
                  {currentTask.description}
                </p>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-xs text-gray-600 font-semibold mb-2">
              <i className="fas fa-tools mr-2"></i> Actions
            </h1>
            <div className="flex flex-wrap flex-row gap-2 md:space-x-0 md:flex-col md:space-y-3">
              <GrayButton icon="fas fa-image mr-2" ref={coverRef}>
                Cover
              </GrayButton>
              <CustomPopover ref={coverRef}>
                <CoverImageMenu></CoverImageMenu>
              </CustomPopover>
              <GrayButton icon="fas fa-tags mr-2" ref={labelRef}>
                Labels
              </GrayButton>
              <CustomPopover ref={labelRef}>
                <LabelGenerator
                  currentLabels={currentTask.tags as any}
                ></LabelGenerator>
              </CustomPopover>
              <GrayButton icon="fas fa-users mr-2" ref={assignmentRef}>
                Members
              </GrayButton>
              <CustomPopover ref={assignmentRef}>
                <Assignment task={currentTask}></Assignment>
              </CustomPopover>
              <button
                className="focus:outline-none px-2 py-2 hover:bg-red-100 ring-red-500 ring-1 text-red-500 rounded-lg"
                onClick={handleDeleteTask}
              >
                <i className="fas fa-trash mr-2"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-y-auto">
        {currentTask.comments && (
          <Comments comments={currentTask.comments}></Comments>
        )}
      </div>
    </div>
  );
}

export default TaskDetails;
