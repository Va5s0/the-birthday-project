import * as React from "react"
import Snackbar from "@material-ui/core/Snackbar"
import { AlertDlg } from "components/AlertDlg"
import { TransitionHandlerProps } from "@material-ui/core/transitions"

export type SnackbarProps = {
  open: boolean
  message: string
  onClose: (event?: React.SyntheticEvent, reason?: string) => void
  severity?: "success" | "info" | "warning" | "error"
  onExited?: TransitionHandlerProps["onExited"]
}

const SnackBar = ({
  open,
  message,
  severity,
  onClose,
  onExited,
}: SnackbarProps) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    onExited={onExited}
    disableWindowBlurListener
  >
    <AlertDlg onClose={onClose} severity={severity} elevation={6}>
      {message}
    </AlertDlg>
  </Snackbar>
)

export { SnackBar }
