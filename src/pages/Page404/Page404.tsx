import React from "react";
import { useHistory } from "react-router-dom";

function Page404() {
  const history = useHistory();

  return (
    <div className="w-screen h-screen bg-blue-300 flex space-y-8 flex-col justify-center items-center">
      <h1
        className="text-9xl font-extrabold text-blue-300"
        style={{
          textShadow:
            " 2px 7px 5px rgba(0,0,0,0.3),  0px -4px 10px rgba(255,255,255,0.3)",
        }}
      >
        404
      </h1>
      <h1
        className="text-4xl md:text-7xl font-extrabold text-blue-300"
        style={{
          textShadow:
            " 2px 7px 5px rgba(0,0,0,0.3),  0px -4px 10px rgba(255,255,255,0.3)",
        }}
      >
        Page not found
      </h1>
      <button
        className="px-4 py-2 bg-white font-bold rounded-xl focus:outline-none"
        onClick={() => history.push("/all")}
        style={{
          boxShadow:
            " 2px 7px 5px rgba(0,0,0,0.3),  0px -4px 10px rgba(255,255,255,0.3)",
        }}
      >
        Go home
      </button>
    </div>
  );
}

export default Page404;
