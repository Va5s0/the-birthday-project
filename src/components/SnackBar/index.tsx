import Snackbar, { SnackbarProps } from "@mui/material/Snackbar"
import { AlertDlg } from "../AlertDlg"

export type CustomSnackbarProps = {
  message: string
  severity?: "success" | "info" | "warning" | "error"
} & Omit<SnackbarProps, "children">

const SnackBar = ({
  open,
  message,
  severity,
  onClose,
  ...props
}: CustomSnackbarProps) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    disableWindowBlurListener
    {...props}
  >
    <AlertDlg onClose={onClose} severity={severity} elevation={6}>
      {message}
    </AlertDlg>
  </Snackbar>
)

export { SnackBar }
