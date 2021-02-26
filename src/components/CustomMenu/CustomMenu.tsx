import { Menu, MenuItem } from "@material-ui/core";
import React, { Ref, RefObject, useEffect, useRef } from "react";

interface Option {
  title: string | JSX.Element;
  onClick?: Function;
}

const CustomMenu = React.forwardRef(
  ({ options }: { options: Option[] }, ref) => {
    const [anchorEl, setAnchorEl] = React.useState<
      EventTarget | null | undefined
    >(null);
    useEffect(() => {
      //@ts-ignore
      if (ref && ref.current) {
        //@ts-ignore
        ref.current.onclick = () => {
          //@ts-ignore
          setAnchorEl(ref.current);
        };
      }
    }, [ref]);

    const displayOptions = (options: Option[]) => {
      return options.map((option, i) => (
        <MenuItem
          key={i}
          onClick={() => {
            if (option.onClick) option.onClick();
          }}
        >
          {option.title}
        </MenuItem>
      ));
    };
    return (
      <div>
        <Menu
          anchorEl={anchorEl as any}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {displayOptions(options)}
        </Menu>
      </div>
    );
  }
);

export default CustomMenu;
