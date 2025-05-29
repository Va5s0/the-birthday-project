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
}: CustomSnackbarProps) => {
  const handleClose = (event: React.SyntheticEvent | Event) => {
    onClose?.(event, "escapeKeyDown")
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      disableWindowBlurListener
      {...props}
    >
      {/* Pass ref automatically via forwardRef in AlertDlg */}
      <AlertDlg onClose={handleClose} severity={severity} elevation={6}>
        {message}
      </AlertDlg>
    </Snackbar>
  )
}

export { SnackBar }
