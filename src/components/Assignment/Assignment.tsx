import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useUpdateCurrentTask from "../../hooks/useUpdateCurrentTask";
import { useLoading } from "../../provider/LoaderProvider";
import { DEFAULT_AVATAR, StateTypes, Task, User } from "../../types";
import CustomImage from "../common/CustomImage/CustomImage";
import Searchbar from "../common/Searchbar/Searchbar";

const UserItem = ({ task, user }: { task: Task; user: User }) => {
  const { saveChangesToCurrentTask } = useUpdateCurrentTask();
  const { showLoader, hideLoader } = useLoading();
  const isUserAssigned = () => {
    return (
      (task.members as User[]).findIndex(
        (assignee) => assignee.email === user.email
      ) >= 0
    );
  };

  const handleAssign = async () => {
    showLoader();
    await saveChangesToCurrentTask(
      {
        ...task,
        members: [...(task.members as []), { ...user }],
      },
      `${user.email} is added to task`
    );
    hideLoader();
  };

  const handleUnAssign = async () => {
    showLoader();
    const members = (task.members as User[]).filter(
      (member) => member.email !== user.email
    );
    await saveChangesToCurrentTask(
      {
        ...task,
        members,
      },
      `${user.email} is removed from task`
    );
    hideLoader();
  };

  return (
    <>
      <div className="flex  space-y-2 justify-between items-center text-left  hover:bg-gray-100 rounded p-2">
        <div className="flex  items-center">
          <CustomImage
            className="w-8 h-8 rounded-lg mr-2"
            src={user.photoURL ? user.photoURL : DEFAULT_AVATAR}
          ></CustomImage>
          <h1 className="text-sm truncate m-0 w-44">{user.email}</h1>
        </div>
        {!isUserAssigned() ? (
          <button
            className="bg-blue-500 text-white rounded-full  focus:outline-none w-7 h-7 flex items-center justify-center  font-semibold m-0"
            onClick={handleAssign}
          >
            <i className="fas fa-plus text-xs"></i>
          </button>
        ) : (
          <button
            className="bg-red-500 text-white rounded-full  focus:outline-none w-7 h-7 flex items-center justify-center  font-semibold m-0"
            onClick={handleUnAssign}
          >
            <i className="fas fa-minus text-xs"></i>
          </button>
        )}
      </div>
    </>
  );
};

const filterUser = (users: User[], searchKey: string) => {
  return users.filter((user) =>
    user.email
      .toLocaleLowerCase()
      .includes(searchKey.trim().toLocaleLowerCase())
  );
};

function Assignment({ task }: { task: Task }) {
  const url = window.location.hash;
  const id: string = url.substring(url.lastIndexOf("/") + 1);
  const boards = useSelector((state: StateTypes) => state.boards);
  const board = boards?.find((board) => board._id === id);
  const searchRef = useRef(null);
  const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void;

  useEffect(() => {
    if (searchRef.current)
      //@ts-ignore
      searchRef.current.onchange = (e) => {
        forceUpdate();
      };
  }, [searchRef]);

  const displayUsers = (users: User[]) => {
    //@ts-ignore
    const searchKey = searchRef.current?.value || "";
    return filterUser(users, searchKey).map((user) => (
      <UserItem user={user} task={task} key={user.email}></UserItem>
    ));
  };

  return (
    <div className="bg-gray-50 p-3 space-y-4 text-center w-80">
      <div className="text-left">
        <h1 className="font-bold text-sm">Assgin to </h1>
        <p className="text-gray-600 text-sm">
          Search user you want to assgin this task to
        </p>
      </div>
      <Searchbar ref={searchRef} placeholder="User..."></Searchbar>
      <div className="bg-white shadow h-48 rounded-xl p-2 overflow-y-auto space-y-2">
        {displayUsers(board?.members as User[])}
      </div>
    </div>
  );
}

export default Assignment;
