import { memo } from "react"
import Snackbar, { SnackbarProps } from "@mui/material/Snackbar"
import { AlertDlg } from "../AlertDlg"

export type CustomSnackbarProps = {
  message: string
  severity?: "success" | "info" | "warning" | "error"
} & Omit<SnackbarProps, "children">

const SnackBar = memo(function SnackBar({
  open,
  message,
  severity,
  onClose,
  ...props
}: CustomSnackbarProps) {
  const handleAlertClose = (event: React.SyntheticEvent) => {
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
      <AlertDlg onClose={handleAlertClose} severity={severity} elevation={6}>
        {message}
      </AlertDlg>
    </Snackbar>
  )
})

export { SnackBar }
