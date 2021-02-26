import React, { useRef, useState } from "react";
import Avatars from "../Avatars/Avatars";
import {
  User,
  MAXIMUM_MEMBERS_DISPLAYED_PER_TASK,
  Task,
  List,
  Board,
  DEFAULT_BOARD_COVER,
  Label,
  TASK_COVER,
} from "../../types";
import CustomMenu from "../CustomMenu/CustomMenu";
import { deleteList, updateList } from "../../api/list/list";
import useUpdateBoard from "../../hooks/useUpdateBoard";
import { useDialog } from "../../provider/DialogProvider";
import NewCard from "../../container/NewCard/NewCard";
import TaskDetails from "../../container/TaskDetails/TaskDetails";
import CustomPopover from "../CustomPopover/CustomPopover";
import Assignment from "../Assignment/Assignment";
import useUpdateCurrentTask from "../../hooks/useUpdateCurrentTask";
import { updateTask } from "../../api/task/task";
import CustomImage from "../common/CustomImage/CustomImage";
import { useLoading } from "../../provider/LoaderProvider";

const Tag = ({ tag }: { tag: Label }) => {
  return (
    <div
      className={`py-1 px-2  ${tag.backgroundColor}  ${tag.fontColor}  focus:outline-none text-xs rounded-full text-center`}
    >
      {tag.content}
    </div>
  );
};

const TaskCard = ({ task }: { task: Task }) => {
  const [openDialog, closeDialog] = useDialog();
  const assignmentRef = useRef(null);

  const handleDragStart = (e: any, id: string) => {
    e.currentTarget.style.backgroundColor = "#E2E8F6";
    e.currentTarget.style.border = "dashed 2px #2F80ED";
    e.dataTransfer.setData("text/plain", id);
  };

  return (
    <>
      <div
        className="space-y-3 bg-white p-3 rounded-2xl shadow-md w-full"
        draggable
        onDragEnd={(e) => {
          e.currentTarget.style.backgroundColor = "#fff";
          e.currentTarget.style.border = "none";
        }}
        onDragStart={(e) => handleDragStart(e, task._id as string)}
        onClick={(e) => {
          e.stopPropagation();
          openDialog({
            children: <TaskDetails taskId={task._id as string}></TaskDetails>,
          });
        }}
      >
        {task.coverURL && (
          <CustomImage
            //@ts-ignore
            src={TASK_COVER[task.coverURL]}
            className="h-28 w-full rounded-lg"
          ></CustomImage>
        )}
        <h1 className="text-lg font-semibold word-wrap break-words">
          {task.title}
        </h1>
        <div className="flex flex-wrap space-x-1 space-y-1">
          {task.tags?.map((tag) => (
            <Tag tag={tag} key={tag.content}></Tag>
          ))}
        </div>

        <div className="flex space-x-2 items-center">
          <Avatars
            members={task.members as []}
            limit={MAXIMUM_MEMBERS_DISPLAYED_PER_TASK}
          ></Avatars>
          <button
            className="w-8 h-8 focus:outline-none bg-blue-500 rounded text-white hover:bg-blue-300"
            ref={assignmentRef}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
      <CustomPopover ref={assignmentRef}>
        <Assignment task={task}></Assignment>
      </CustomPopover>
    </>
  );
};

function TaskList({ board, list }: { board: Board; list: List }) {
  const optionsRef = useRef(null);
  const titleRef = useRef(null);
  const { saveChangesToBoard } = useUpdateBoard();
  const [rename, setRename] = useState(false);
  const [openDialog, closeDialog] = useDialog();
  const { showLoader, hideLoader } = useLoading();

  const handleDelete = async () => {
    showLoader();
    const result = await deleteList(list);
    if (result.status) {
      return;
    }
    const newLists = board.lists?.filter((item) => item._id !== list._id);
    if (newLists)
      await saveChangesToBoard(
        { ...board, lists: [...newLists] },
        `${list.title} has been removed from this board`
      );
    hideLoader();
  };

  const handleRename = async () => {
    showLoader();
    if (!titleRef.current) return;
    const name = (titleRef.current as any).value;
    let result = await updateList({ ...list, title: name });
    if (result.status) {
      return;
    }

    const inx = board.lists?.findIndex((item) => item._id == list._id);
    const newLists = (board.lists as List[]).filter(
      (item) => item._id !== list._id
    );
    newLists.splice(inx as number, 0, { ...list, title: name });

    result = await saveChangesToBoard(
      { ...board, lists: [...newLists] },
      `Task list has been renamed to ${name}`
    );
    if (!result.status) setRename(false);
    hideLoader();
  };

  const handleDrop = async (e: any, endList: List) => {
    const id = e.dataTransfer.getData("text/plain");
    const sourceList = (board.lists as List[]).find(
      (list) => list.tasks.findIndex((task) => task._id === id) >= 0
    );
    const targetTask = sourceList?.tasks.find((task) => task._id === id);
    if (!targetTask) return;
    if (sourceList?.tasks)
      sourceList.tasks = sourceList?.tasks.filter(
        (task) => task._id !== targetTask?._id
      );
    endList.tasks.push(targetTask as Task);
    board.lists = (board.lists as List[]).map((item) => {
      if (item._id === sourceList?._id) return sourceList;
      else if (item._id === endList._id) return endList;
      else return item;
    }) as List[];
    await saveChangesToBoard({ ...board });
  };
  return (
    <div
      className="h-full space-y-4"
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => handleDrop(e, list)}
      style={{ width: "220px" }}
    >
      <div className="flex flex-wrap justify-between items-center">
        {rename ? (
          <div className="flex space-x-1 items-center">
            <input
              className="focus:outline-none rounded-lg py-1 foucs:ring-blue-500 focus:ring-1 shadow px-1"
              placeholder="Type here"
              defaultValue={list.title}
              ref={titleRef}
              onKeyUp={(e) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                  handleRename();
                }
              }}
            ></input>
          </div>
        ) : (
          <h1 className="break-all">{list.title}</h1>
        )}
        <div>
          <i className="fas fa-ellipsis-h cursor-pointer" ref={optionsRef}></i>
          <CustomMenu
            ref={optionsRef}
            options={[
              { title: "Rename", onClick: () => setRename(true) },
              { title: "Delete this list", onClick: handleDelete },
            ]}
          ></CustomMenu>
        </div>
      </div>
      {list?.tasks?.map((task) => (
        <TaskCard key={task._id} task={task}></TaskCard>
      ))}
      <button
        className="bg-blue-100 focus:outline-none p-2 rounded-xl text-blue-500 flex justify-between items-center w-full"
        onClick={() => {
          openDialog({
            children: <NewCard board={board} list={list}></NewCard>,
          });
        }}
        style={{ width: "220px" }}
      >
        <span>Add another card</span>
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
}

export default TaskList;
