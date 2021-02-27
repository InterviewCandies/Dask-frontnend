import { Tooltip } from "@material-ui/core";
import shadows from "@material-ui/core/styles/shadows";
import { useSnackbar } from "notistack";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import useUpdateCurrentTask from "../../hooks/useUpdateCurrentTask";
import { useLoading } from "../../provider/LoaderProvider";
import { LABEL_COLORS, Label, LabelColors, StateTypes } from "../../types";

const Tag = ({ tag }: { tag: Label }) => {
  const currentTask = useSelector((state: StateTypes) => state.task);
  const { saveChangesToCurrentTask } = useUpdateCurrentTask();
  const handleDeleteLabel = async () => {
    const newTags = currentTask.tags?.filter(
      (item) =>
        item.content !== tag.content ||
        item.backgroundColor !== tag.backgroundColor
    );
    const result = await saveChangesToCurrentTask({
      ...currentTask,
      tags: [...(newTags as [])],
    });
  };
  return (
    <Tooltip title="Click to remove">
      <button
        className={`py-1 px-2  ${tag.backgroundColor}  ${tag.fontColor} break-words  focus:outline-none text-xs rounded-full w-min`}
        onClick={handleDeleteLabel}
      >
        {tag.content}
      </button>
    </Tooltip>
  );
};

const initialColorsState: Boolean[] = LABEL_COLORS.map(() => false);

function LabelGenerator({ currentLabels }: { currentLabels: Label[] }) {
  const [colors, setColors] = useState<Boolean[]>([...initialColorsState]);
  const currentTask = useSelector((state: StateTypes) => state.task);
  const { saveChangesToCurrentTask } = useUpdateCurrentTask();
  const inputRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const { showLoader, hideLoader } = useLoading();

  const handleAddLabel = async () => {
    const text = (inputRef.current as any).value;
    if (text.trim().length == 0) {
      enqueueSnackbar("Label must not be empty", { variant: "error" });
      return;
    }
    showLoader();
    let choosenColor = colors.findIndex((color) => color == true);
    if (choosenColor < 0) choosenColor = 0;
    const newLabel: Label = {
      content: text,
      backgroundColor: LABEL_COLORS[choosenColor].backgroundColor,
      fontColor: LABEL_COLORS[choosenColor].fontColor,
    };

    const result = await saveChangesToCurrentTask({
      ...currentTask,
      tags: [...(currentTask.tags as []), { ...newLabel }],
    });
    hideLoader();
  };
  return (
    <div className="bg-white p-3 space-y-2 w-min">
      <h1 className="font-semibold">Label</h1>
      <input
        className="bg-gray-200 px-2 py-1 rounded-lg focus:ring-blue-500 focus:ring-2 focus:outline-none"
        placeholder="Label..."
        ref={inputRef}
      ></input>

      <div className="grid grid-cols-3 gap-2">
        {LABEL_COLORS.map((color, i) => (
          <button
            key={color.backgroundColor}
            className={`w-15 h-10 ${color.backgroundColor} focus:outline-none`}
            onClick={() =>
              setColors((prevState) => {
                prevState = [...initialColorsState];
                prevState[i] = true;
                return prevState;
              })
            }
          >
            {colors[i] && <i className="fas fa-check text-white"></i>}
          </button>
        ))}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-semibold">Current labels</p>
        <div className="flex space-x-1 flex-wrap space-y-1">
          {currentLabels.map((label) => (
            <Tag tag={label}></Tag>
          ))}
        </div>
      </div>
      <div className="text-center">
        <button
          className="bg-blue-500  font-semibold text-white rounded-xl px-4 py-1 focus:outline-none"
          onClick={handleAddLabel}
        >
          <i className="fas fa-plus mr-2"></i>Add
        </button>
      </div>
    </div>
  );
}

export default LabelGenerator;
