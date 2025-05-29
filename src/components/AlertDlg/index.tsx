import React from "react"
import { css, cx } from "@emotion/css"
import Alert, { AlertProps } from "@mui/material/Alert"
import InfoIcon from "@mui/icons-material/Info"
import ErrorIcon from "@mui/icons-material/Error"
import WarningIcon from "@mui/icons-material/Warning"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

export type AlertDlgProps = AlertProps

export const AlertDlg = React.forwardRef<HTMLDivElement, AlertDlgProps>(
  function AlertDlg(props, ref) {
    const {
      severity,
      children,
      action,
      elevation,
      variant = "filled",
      ...rest
    } = props

    return (
      <Alert
        ref={ref}
        severity={severity}
        onClose={props.onClose}
        action={action}
        variant={variant}
        iconMapping={{
          info: <InfoIcon />,
          error: <ErrorIcon />,
          warning: <WarningIcon />,
          success: <CheckCircleIcon />,
        }}
        classes={{
          root: styles.root,
          action: styles.action,
          icon: styles.icon,
          message: cx("BodyBody-1WhiteRegular", styles.message),
          filledInfo: styles.info,
          filledError: styles.error,
          filledWarning: styles.warning,
          filledSuccess: styles.success,
        }}
        elevation={elevation}
        {...rest}
      >
        {children}
      </Alert>
    )
  }
)

const styles = {
  root: css`
    padding: 4px 16px;
    box-shadow: none;
    display: flex;
    align-items: center;
  `,
  action: css`
    margin-right: 0;
    padding-left: 0;
  `,
  icon: css`
    margin-right: 8px;
  `,
  message: css`
    padding: 9px 0;
  `,
  info: css`
    background-color: var(--primary-light);
  `,
  error: css`
    background-color: var(--red);
  `,
  warning: css`
    background-color: var(--warning);
  `,
  success: css`
    background-color: var(--primary-main);
  `,
}
