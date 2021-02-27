import classes from "*.module.sass";
import { Drawer, makeStyles } from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Dispatch } from "redux";
import { createList } from "../../api/list/list";
import { fetchUsers } from "../../api/user";
import Avatars from "../../components/Avatars/Avatars";
import CustomImage from "../../components/common/CustomImage/CustomImage";
import GrayButton from "../../components/common/GrayButton/GrayButton";
import Layout from "../../components/common/Layout/Layout";
import Loader from "../../components/common/Loader/Loader";
import Searchbar from "../../components/common/Searchbar/Searchbar";
import CustomPopover from "../../components/CustomPopover/CustomPopover";
import TaskList from "../../components/TaskList/TaskList";
import BoardMenu from "../../container/BoardMenu/BoardMenu";
import useUpdateBoard from "../../hooks/useUpdateBoard";
import { useLoading } from "../../provider/LoaderProvider";
import {
  Board,
  DEFAULT_AVATAR,
  MAXIMUM_MEMBERS_DISPLAYED_PER_BOARD,
  StateTypes,
  User,
} from "../../types";

const useStyles = makeStyles((theme) => ({
  paper: {
    fontFamily: `ui-sans-serif system-ui -apple-system BlinkMacSystemFont Segoe UI Roboto Helvetica Neue Arial Noto Sans
        sans-serif
      Apple Color Emoji
      Segoe UI Emoji
      Segoe UI Symbol
      Noto Color Emoji`,
  },
}));

const VisilityMenu = ({
  id,
  closePopover,
}: {
  id: string;
  closePopover?: Function;
}) => {
  const boards = useSelector((state: StateTypes) => state.boards);
  const board = boards.find((board) => board._id === id);
  const { saveChangesToBoard } = useUpdateBoard();
  const { showLoader, hideLoader } = useLoading();

  const handleClick = async (status: Boolean) => {
    showLoader();
    const newBoard = { ...board, visibility: status };
    const result = await saveChangesToBoard(
      newBoard as Board,
      "Board is updated"
    );
    if (!result.status && closePopover) closePopover();
    hideLoader();
  };

  return (
    <>
      <div className="bg-white p-3 w-min space-y-3">
        <div>
          <h1 className="font-bold text-sm">Visibility</h1>
          <p className="text-gray-600 text-sm mt-1">
            Choose who can see to this board
          </p>
        </div>
        <button
          className={`space-y-3 rounded-xl focus:outline-none w-60 text-left p-2 pl-3 ${
            board?.visibility ? " hover:bg-gray-100" : "bg-gray-100"
          }`}
          disabled={board?.visibility === false}
          onClick={() => handleClick(false)}
        >
          <p className="font-semibold text-gray-600 text-sm mb-1">
            <i className="fas fa-globe-asia mr-2"></i> Public
          </p>
          <p className="text-xs text-gray-700 mt-0">
            Anyone on internet can see this
          </p>
        </button>
        <button
          className={`space-y-3 rounded-xl focus:outline-none w-60 text-left p-2 pl-3 ${
            board?.visibility ? "bg-gray-100" : "hover:bg-gray-100"
          }`}
          disabled={board?.visibility === true}
          onClick={() => handleClick(true)}
        >
          <p className="font-semibold text-gray-600 text-sm mb-1">
            <i className="fas fa-lock mr-2"></i> Private
          </p>
          <p className="text-xs text-gray-600 mt-0">
            Only board members can see this
          </p>
        </button>
      </div>
    </>
  );
};

const UserItem = ({ user, id }: { user: User; id: string }) => {
  const boards = useSelector((state: StateTypes) => state.boards);
  const board = boards.find((board) => board._id === id);
  const { showLoader, hideLoader } = useLoading();

  const { saveChangesToBoard } = useUpdateBoard();
  const addToBoard = async () => {
    showLoader();
    const newBoard = {
      ...board,
      members: [...(board?.members as []), { ...user }],
    };
    await saveChangesToBoard(
      newBoard as Board,
      `${user.email} is added to board`
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
        <button
          className="bg-blue-500 text-white rounded-full  focus:outline-none w-7 h-7 flex items-center justify-center  font-semibold m-0"
          onClick={addToBoard}
        >
          <i className="fas fa-plus text-xs"></i>
        </button>
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

const InvitationMenu = ({ id }: { id: string }) => {
  const boards = useSelector((state: StateTypes) => state.boards);
  const board = boards?.find((board) => board._id === id);
  const searchRef = useRef(null);
  let users = useSelector((state: StateTypes) => state.users);
  const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void;
  users = users.filter(
    (user) =>
      (board?.members as User[]).findIndex(
        (member) => user.email === member.email
      ) < 0
  );

  const displayUsers = (users: User[], id: string) => {
    //@ts-ignore
    const searchKey = searchRef.current?.value || "";
    return filterUser(users, searchKey).map((user) => (
      <UserItem user={user} key={user.email} id={id}></UserItem>
    ));
  };

  useEffect(() => {
    if (searchRef.current)
      //@ts-ignore
      searchRef.current.onchange = (e) => {
        forceUpdate();
      };
  }, [searchRef]);

  return (
    <div className="bg-gray-50 p-3 space-y-4 text-center w-80">
      <div className="text-left">
        <h1 className="font-bold text-sm">Invite to board</h1>
        <p className="text-gray-600 text-sm">Search user you want to invite</p>
      </div>
      <Searchbar ref={searchRef} placeholder="User..."></Searchbar>
      <div className="bg-white shadow h-48 rounded-xl p-2 overflow-y-auto space-y-2">
        {displayUsers(users, id)}
      </div>
    </div>
  );
};

function BoardDetails() {
  const visibilityRef = useRef(null);
  const invitationRef = useRef(null);
  const dispatch: Dispatch<any> = useDispatch();
  const [openMenu, setOpenMenu] = useState(false);
  const { showLoader, hideLoader } = useLoading();
  const { saveChangesToBoard } = useUpdateBoard();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    async function fetchAllUsers() {
      try {
        const result = await dispatch(fetchUsers());
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllUsers();
  }, []);

  const addNewList = async () => {
    showLoader();
    const result = await createList({ title: "Untitle", tasks: [] });
    if (result.status) {
      enqueueSnackbar(result.message, { variant: "error" });
      hideLoader();
      return;
    }
    await saveChangesToBoard(
      {
        ...board,
        lists: [...(board?.lists as []), { ...result.data }],
      } as Board,
      "New list is added to board"
    );
    hideLoader();
  };

  const url = window.location.hash;
  const id: string = url.substring(url.lastIndexOf("/") + 1);
  const boards = useSelector((state: StateTypes) => state.boards);
  const board = boards?.find((board) => board._id === id);
  if (!board) {
    history.push("/404");
    return null;
  }
  const { visibility, title, members } = board;

  return (
    <div>
      <Layout>
        <div className="bg-white w-full h-screen px-5">
          <div className="bg-white flex mb-5 pt-5 justify-between">
            <div className="flex space-x-2 items-center">
              <div>
                <GrayButton
                  icon={visibility ? "fas fa-lock" : "fas fa-globe-asia"}
                  onClick={() => {}}
                  ref={visibilityRef}
                >
                  <span className="hidden sm:inline">
                    {visibility ? "Private" : "Public"}
                  </span>
                </GrayButton>
                <CustomPopover ref={visibilityRef}>
                  <VisilityMenu id={board._id}></VisilityMenu>
                </CustomPopover>
              </div>
              <div className="flex space-x-2 items-center">
                {members && (
                  <Avatars
                    members={members}
                    limit={MAXIMUM_MEMBERS_DISPLAYED_PER_BOARD}
                  ></Avatars>
                )}
                <div>
                  <button
                    className="w-8 h-8 bg-blue-500 rounded text-white hover:bg-blue-300 focus:outline-none"
                    ref={invitationRef}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <CustomPopover ref={invitationRef}>
                    <InvitationMenu id={id}></InvitationMenu>
                  </CustomPopover>
                </div>
              </div>
            </div>
            <div>
              <GrayButton
                icon="fas fa-bars"
                className="items-end"
                onClick={() => setOpenMenu(true)}
              >
                <span className="hidden sm:inline">Menu</span>
              </GrayButton>
              <Drawer
                anchor="right"
                open={openMenu}
                classes={{
                  paper: classes.paper,
                }}
                onClose={() => setOpenMenu(false)}
              >
                <BoardMenu
                  board={board}
                  onClose={() => setOpenMenu(false)}
                ></BoardMenu>
              </Drawer>
            </div>
          </div>
          <div className="bg-blue-50 w-full h-full rounded-t-3xl flex flex-nowrap gap-4	 px-5 pt-5 overflow-auto">
            {board.lists?.map((list) => (
              <TaskList key={list._id} board={board} list={list}></TaskList>
            ))}
            <div>
              <button
                className="bg-blue-100 p-2   focus:outline-none rounded-xl text-blue-500 flex justify-between items-center w-full"
                onClick={addNewList}
                style={{ width: "220px" }}
              >
                <span>Add new list</span>
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default BoardDetails;
