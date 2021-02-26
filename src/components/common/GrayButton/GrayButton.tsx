import React from "react";

interface Props {
  children: JSX.Element | string;
  icon?: string;
  color?: string;
  onClick?: Function;
  active?: boolean;
  className?: string;
}

const GrayButton = React.forwardRef((props: Props, ref) => {
  const { icon, color, onClick, active, className, children } = props;
  return (
    <button
      type="button"
      className={`bg-gray-200 text-gray-500 text-left py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none ${color} ${
        active ? "bg-blue-500 text-white" : ""
      }  ${className}`}
      ref={ref as any}
      onClick={(e) => {
        e.stopPropagation();
        if (props.onClick) props.onClick();
      }}
      style={props.active ? { color: "#fff" } : {}}
    >
      {icon ? <i className={`${icon} ${active && "text-white"}`}></i> : null}{" "}
      {children}
    </button>
  );
});

export default GrayButton;
