import { useSnackbar } from "notistack";
import React, { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateBoards } from "../../actions/board";
import { deleteBoard } from "../../api/board";
import CustomImage from "../../components/common/CustomImage/CustomImage";
import Loader from "../../components/common/Loader/Loader";
import useUpdateBoard from "../../hooks/useUpdateBoard";
import { useLoading } from "../../provider/LoaderProvider";
import { Board, DEFAULT_AVATAR, StateTypes, User } from "../../types";
import { formatDate } from "../../utils/formatDate";

const UserItem = ({
  owner,
  user,
  id,
}: {
  owner: string;
  user: User;
  id: string;
}) => {
  const boards = useSelector((state: StateTypes) => state.boards);
  const board = boards.find((board) => board._id === id);
  const { saveChangesToBoard } = useUpdateBoard();
  const currentUser = useSelector((state: StateTypes) => state.user);
  const { showLoader, hideLoader } = useLoading();

  const removeFromBoard = async () => {
    showLoader();
    if (board?.lists)
      board.lists = board?.lists.map((list) => {
        return {
          ...list,
          tasks: list.tasks.map((task) => {
            return {
              ...task,
              members: task.members?.filter(
                (member) => member.email !== user.email
              ),
            };
          }),
        };
      });
    const newBoard = {
      ...board,
      members: [
        ...(board?.members as User[]).filter(
          (member) => member.email != user.email
        ),
      ],
    };
    await saveChangesToBoard(
      newBoard as Board,
      `${user.email} has been removed from board`
    );
    hideLoader();
  };

  return (
    <>
      <div className="flex space-y-2 justify-between items-center rounded pb-4">
        <div className="flex justify-center  items-center">
          <CustomImage
            className="w-8 h-8 rounded-lg mr-2"
            src={user.photoURL ? user.photoURL : DEFAULT_AVATAR}
          ></CustomImage>
          <h1 className="text-sm truncate m-0 w-44">{user.email}</h1>
        </div>
        {owner !== user.email ? (
          <>
            {(currentUser.email === owner ||
              currentUser.email === user.email) && (
              <button
                className="ring-red-500 ring-2 text-red-500 hover:bg-red-100 rounded-full  focus:outline-none w-5 h-5 flex items-center justify-center  font-semibold m-0"
                onClick={removeFromBoard}
              >
                <i className="fas fa-minus text-xs"></i>
              </button>
            )}{" "}
          </>
        ) : (
          <span className="text-xs text-gray-600">Admin</span>
        )}
      </div>
    </>
  );
};

const displayUsers = (users: User[], id: string, owner: string) => {
  return users.map((user) => (
    <UserItem owner={owner} user={user} key={user.email} id={id}></UserItem>
  ));
};

function BoardMenu({ board, onClose }: { board: Board; onClose: () => void }) {
  const [edit, setEdit] = useState(false);
  const descriptionRef = useRef(null);
  const { saveChangesToBoard } = useUpdateBoard();
  const currentUser = useSelector((state: StateTypes) => state.user);
  const boards = useSelector((state: StateTypes) => state.boards);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const history = useHistory();
  const { showLoader, hideLoader } = useLoading();

  const handleSaveDescription = async () => {
    showLoader();
    if (descriptionRef.current) {
      const description =
        (descriptionRef.current as any).value.trim() || "No description";
      const newBoard = { ...board, description };
      const result = await saveChangesToBoard(
        newBoard,
        "Description has been updated"
      );
      if (!result.status) setEdit(false);
    }
    hideLoader();
  };
  const updateReduxBoard = useCallback(
    (boards: Board[]) => dispatch(updateBoards(boards)),
    [dispatch]
  );

  const handleDeleteBoard = async () => {
    showLoader();
    const result = await deleteBoard(board._id);
    if (result.status) {
      enqueueSnackbar(result.message, { variant: "error" });
      hideLoader();
      return;
    }
    const newBoards = boards.filter((item) => item._id !== board._id);
    updateReduxBoard([...newBoards]);
    enqueueSnackbar(`Board ${board.title} has been deleted`, {
      variant: "success",
    });
    hideLoader();
    history.push("/all");
  };
  return (
    <div className="bg-white w-80 p-4 space-y-7">
      <div className="flex justify-between items-center">
        <h1 className="font-bold">Menu</h1>
        <i
          className="fas fa-times cursor-pointer"
          onClick={() => onClose()}
        ></i>
      </div>
      <hr className="my-2"></hr>
      <div className="space-y-3">
        <h1 className="break-words font-bold">{board.title} Board</h1>
        <h1 className="text-xs text-gray-600 font-semibold">
          <i className="fas fa-user mr-1"></i> Made by
        </h1>
        <div className="flex space-x-2 items-center">
          <CustomImage
            src={board.coverURL || DEFAULT_AVATAR}
            className="w-9 h-9 rounded-lg"
          ></CustomImage>
          <div>
            <h1 className="text-sm font-bold">{board.owner}</h1>
            <h1 className="text-xs text-gray-500">
              on {board.createdDate && formatDate(board.createdDate)}
            </h1>
          </div>
        </div>
      </div>
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
              className="ring-2 ring-gray-200 rounded-lg w-full focus:outline-none"
              style={{ padding: "0.5rem" }}
            >
              {board.description}
            </textarea>
            <div className="flex space-x-2 mt-2">
              <button
                className="hover:bg-green-100 font-semibold text-green-500 px-3 py-1 rounded-xl focus:outline-none"
                onClick={handleSaveDescription}
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
          <p className="text-sm m-0">{board.description}</p>
        )}
      </div>
      <div className="space-y-3">
        <h1 className="text-xs text-gray-600 font-semibold">
          <i className="fas fa-users mr-2"></i> Team
        </h1>
        <div>
          {board.members &&
            board.owner &&
            displayUsers(board.members, board._id, board.owner)}
        </div>
        {currentUser.email === board.owner && (
          <button
            className="w-full hover:bg-red-300 tex-sn focus:outline-none w-11/12 ring-red-500 ring-2 text-red-500 px-2 py-2 "
            onClick={handleDeleteBoard}
          >
            <i className="fas fa-trash mr-2"></i> Delete this board
          </button>
        )}
      </div>
    </div>
  );
}

export default BoardMenu;
