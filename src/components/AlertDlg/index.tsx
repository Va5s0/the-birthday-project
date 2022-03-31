import { css, cx } from "@emotion/css"
import Alert, { AlertProps } from "@material-ui/lab/Alert"
import InfoIcon from "@material-ui/icons/Info"
import ErrorIcon from "@material-ui/icons/Error"
import WarningIcon from "@material-ui/icons/Warning"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"

const styles = {
  root: css`
    padding: var(--spacing-xxs) var(--spacing-m);
    box-shadow: none;
    display: flex;
    align-items: center;
  `,
  action: css`
    margin-right: 0;
    padding-left: 0;
  `,
  icon: css`
    margin-right: var(--spacing-xs);
  `,
  message: css`
    padding: 9px 0;
  `,
  info: css`
    background-color: var(--secondary-light-blue);
  `,
  error: css`
    background-color: var(--red);
  `,
  warning: css`
    background-color: var(--tertiary-light-yellow);
  `,
  success: css`
    background-color: var(--primary-main);
  `,
}

export type AlertDlgProps = {
  close?: () => void
} & AlertProps

export function AlertDlg(props: AlertDlgProps) {
  const {
    severity,
    close,
    children,
    action,
    elevation,
    variant = "filled",
  } = props

  return (
    <Alert
      severity={severity}
      onClose={close}
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
      {...props}
    >
      {children}
    </Alert>
  )
}
