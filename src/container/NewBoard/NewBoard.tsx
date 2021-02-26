import React, {
  useRef,
  useState,
  useEffect,
  SetStateAction,
  useCallback,
} from "react";
import GrayButton from "../../components/common/GrayButton/GrayButton";
import fallbackImage from "../../assets/img/fallback.jpg";
import { useForm } from "react-hook-form";
import {
  Board,
  CURRENT_USER,
  DEFAULT_BOARD_COVER,
  Message,
  StateTypes,
} from "../../types";
import { createBoard } from "../../api/board";
import { uploadImage } from "../../api/firebase/filesStorage";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { addBoard } from "../../actions/board";
import { useDialog } from "../../provider/DialogProvider";
import { useLoading } from "../../provider/LoaderProvider";
function NewBoard() {
  const [visibility, setVisibility] = useState(false);
  const { register, handleSubmit } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const fileRef = useRef();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState();
  const [, closeDialog] = useDialog();
  const user = useSelector((state: StateTypes) => state.user);
  const { showLoader, hideLoader } = useLoading();
  // create a preview as a side effect, whenever selected file is changed
  // Reference: https://stackoverflow.com/a/57781164/14480038

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    //@ts-ignore
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const addNewBoard = useCallback((board: Board) => dispatch(addBoard(board)), [
    dispatch,
  ]);

  const onSelectFile = (e: any) => {
    e.stopPropagation();
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const onSubmit = async (data: Board) => {
    showLoader();
    data.visibility = visibility;
    let result: Message = {};

    if (selectedFile) {
      result = await uploadImage(selectedFile);
      if (result.status) {
        hideLoader();
        enqueueSnackbar(result.message, { variant: "error" });
        return;
      }
    }
    data.coverURL = result?.data || DEFAULT_BOARD_COVER;
    data.owner = user.email;
    data.members = [{ email: user.email, photoURL: user.photoURL }];
    result = await createBoard(data);
    if (result.status) {
      enqueueSnackbar(result.message, { variant: "error" });
      hideLoader();
      return;
    }
    enqueueSnackbar("Board is added", { variant: "success" });
    addNewBoard(result.data);
    hideLoader();
    closeDialog();
  };
  return (
    <form
      className="relative bg-white p-4 flex-col flex space-y-8 min-w-min md:w-96 rounded p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <img
        className="w-full h-40"
        src={preview ? preview : fallbackImage}
      ></img>

      <input
        className="bg-gray-200 rounded-lg p-3 outline-none border-gray-300"
        placeholder="Add board title"
        name="title"
        ref={register({ required: true })}
      ></input>
      <div className="flex justify-between w-full grid grid-cols-2 space-x-2">
        <GrayButton
          icon="fas fa-image mr-2"
          onClick={() => {
            (fileRef.current as any)!.click();
          }}
        >
          Cover
        </GrayButton>
        <input
          type="file"
          className="hidden"
          name="cover"
          onChange={onSelectFile}
          ref={(e) => {
            register(e);
            //@ts-ignore
            fileRef.current = e;
          }}
        ></input>
        <GrayButton
          icon="fas fa-lock mr-2"
          active={visibility}
          onClick={() => setVisibility((prevState) => !prevState)}
        >
          Private
        </GrayButton>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          className="py-2 px-3 hover:bg-gray-200 focus:outline-none rounded-lg"
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
  );
}

export default NewBoard;
