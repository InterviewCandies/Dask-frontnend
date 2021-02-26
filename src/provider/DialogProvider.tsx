// thank to: https://codesandbox.io/s/dialogprovider-bz1j1?file=/src/DialogProvider.tsx
import { Dialog, makeStyles } from "@material-ui/core";
import React from "react";

type ProviderContext = readonly [(option: DialogOption) => void, () => void];

const EMPTY_FUNC = () => {};
const DialogContext = React.createContext<ProviderContext>([
  EMPTY_FUNC,
  EMPTY_FUNC,
]);
export const useDialog = () => React.useContext(DialogContext);

type DialogParams = {
  children: JSX.Element;
  open: boolean;
  style?: React.CSSProperties;
  onClose?: Function;
  onExited?: Function;
};
type DialogOption = Omit<DialogParams, "open">;
type DialogContainerProps = DialogParams & {
  onClose: () => void;
  onKill: () => void;
};

function DialogContainer(props: DialogContainerProps) {
  const { children, open, style, onClose, onKill } = props;
  const useStyle = makeStyles(() => ({
    paper: {
      ...style,
      position: "relative",
      fontFamily: `ui-sans-serif system-ui -apple-system BlinkMacSystemFont Segoe UI Roboto Helvetica Neue Arial Noto Sans
        sans-serif
      Apple Color Emoji
      Segoe UI Emoji
      Segoe UI Symbol
      Noto Color Emoji`,
    },

    scrollPaper: {
      height: "auto",
      alignItems: "start",
    },
    container: {
      height: "auto",
    },
  }));
  const classes = useStyle();

  return (
    <Dialog
      classes={{
        paper: classes.paper,
      }}
      open={open}
      onClose={onClose}
      onExited={onKill}
    >
      {children}
    </Dialog>
  );
}

export default function DialogProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [dialogs, setDialogs] = React.useState<DialogParams[]>([]);
  const createDialog = (option: DialogOption) => {
    const dialog = { ...option, open: true };
    setDialogs((dialogs) => [...dialogs, dialog]);
  };
  const closeDialog = () => {
    setDialogs((dialogs) => {
      const latestDialog = dialogs.pop();
      if (!latestDialog) return dialogs;
      if (latestDialog.onClose) latestDialog.onClose();
      if (latestDialog.onExited) latestDialog.onExited();
      return [...dialogs];
    });
  };
  const contextValue = React.useRef([createDialog, closeDialog] as const);

  return (
    <DialogContext.Provider value={contextValue.current}>
      {children}
      {dialogs.map((dialog, i) => {
        const { onClose, ...dialogParams } = dialog;
        const handleKill = () => {
          if (dialog.onExited) dialog.onExited();
          setDialogs((dialogs) => dialogs.slice(0, dialogs.length - 1));
        };

        return (
          <DialogContainer
            key={i}
            onClose={closeDialog}
            onKill={handleKill}
            {...dialogParams}
          />
        );
      })}
    </DialogContext.Provider>
  );
}
