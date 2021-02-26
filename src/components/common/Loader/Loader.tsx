import zIndex from "@material-ui/core/styles/zIndex";
import React from "react";
import { ScaleLoader } from "react-spinners";
type Props = {
  loading?: boolean | undefined;
  color?: string;
  title?: string;
};

const DEFAULT_COLOR = "#001eb3";

function Loader({ loading, color, title }: Props) {
  return (
    <div
      className="fixed top-0  bottom-0 right-0 left-0 bg-gray-500 opacity-80 flex m-0 p-0 justify-center items-center"
      style={{ zIndex: 2000 }}
    >
      <div className="flex flex-col justify-center items-center">
        <ScaleLoader
          color={color || DEFAULT_COLOR}
          loading={loading || true}
          //@ts-ignore
          size="40"
        ></ScaleLoader>
        <h1 className="text-2xl capitilize font-bold">
          {title ? title : "Processing ..."}
        </h1>
      </div>
    </div>
  );
}

export default Loader;
