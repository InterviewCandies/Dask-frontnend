import React from "react";
import Header from "../Header/Header";
function Layout(props: { children: JSX.Element }) {
  return (
    <div className="bg-blue-50 w-screen h-screen font-mono overflow-x-hidden">
      <Header></Header>
      {props.children}
    </div>
  );
}

export default Layout;
