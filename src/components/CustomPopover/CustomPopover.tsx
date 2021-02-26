import { makeStyles, Popover } from "@material-ui/core";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  paper: {
    borderRadius: "16px",
  },
}));

const CustomPopover = React.forwardRef(
  ({ children }: { children: JSX.Element }, ref) => {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    useEffect(() => {
      //@ts-ignore
      if (ref && ref.current) {
        //@ts-ignore
        ref.current.onclick = (e) => {
          e.stopPropagation();
          //@ts-ignore
          setAnchorEl(ref.current);
        };
      }
    }, [ref]);

    const open = Boolean(anchorEl);
    const classes = useStyles();

    return (
      <Popover
        open={open}
        anchorEl={anchorEl as Element}
        classes={{
          paper: classes.paper,
        }}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {
          // Thanks to https://stackoverflow.com/a/35102287/14480038
          React.cloneElement(children, {
            closePopover: () => setAnchorEl(null),
          })
        }
      </Popover>
    );
  }
);

export default CustomPopover;
