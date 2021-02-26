import React, { useState } from "react";
import { useSelector } from "react-redux";
import useUpdateCurrentTask from "../../hooks/useUpdateCurrentTask";
import { useLoading } from "../../provider/LoaderProvider";
import { StateTypes, TASK_COVER } from "../../types";
import CustomImage from "../common/CustomImage/CustomImage";

function CoverImageMenu() {
  const [currentImage, setCurrentImage] = useState("");
  const { saveChangesToCurrentTask } = useUpdateCurrentTask();
  const currentTask = useSelector((state: StateTypes) => state.task);
  const { showLoader, hideLoader } = useLoading();

  const handleChange = async () => {
    if (!currentImage.length) return;
    showLoader();
    await saveChangesToCurrentTask({ ...currentTask, coverURL: currentImage });
    hideLoader();
  };
  return (
    <div className="bg-white p-3 space-y-3">
      <h1 className="font-semibold">Choose a cover </h1>
      <div className="grid grid-cols-3 gap-2">
        {console.log(TASK_COVER)}
        {Object.keys(TASK_COVER).map((cover) => (
          <CustomImage
            className={`w-20 h-10 ${
              cover === currentImage ? "opacity-30" : ""
            } relative`}
            ///@ts-ignore
            src={TASK_COVER[cover]}
            onClick={() => setCurrentImage(cover)}
          ></CustomImage>
        ))}
      </div>
      <div className="text-center">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded-xl  hover:bg-blue-300 focus:outline-none"
          onClick={handleChange}
        >
          <i className="fas fa-image mr-2"></i> Change
        </button>
      </div>
    </div>
  );
}

export default CoverImageMenu;
