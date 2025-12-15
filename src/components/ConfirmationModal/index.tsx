import { ReactNode, MouseEvent, memo } from "react"
import MUIDialog from "@mui/material/Dialog"
import { css, cx } from "@emotion/css"
import { Button, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

export type ModalInfo =
  | {
      type?: "primary" | "destructive"
      title?: string
      description?: ReactNode
      onSubmit?: (event: MouseEvent<HTMLButtonElement>) => void
      confirmLabel?: string
    }
  | undefined

type Props = ModalInfo & {
  open: boolean
  onCancel: (event?: MouseEvent<HTMLElement> | {}, reason?: string) => void
}

const ConfirmationModal = memo(function ConfirmationModal(props: Props) {
  const { open, onCancel, title, description, confirmLabel, type, onSubmit } =
    props
  const titleId = "alert-dialog-title"
  const descriptionId = "alert-dialog-description"
  return (
    <MUIDialog
      className={styles.dialog}
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div data-dialog-header className={styles.header}>
        <div id={titleId} className={styles.title}>
          {title}
        </div>
        <div data-dialog-close-button className={styles.close}>
          <IconButton aria-label="close" onClick={onCancel}>
            <CloseIcon className={styles.icon} />
          </IconButton>
        </div>
      </div>

      <div data-dialog-content className={styles.content}>
        <p id={descriptionId} className={styles.contentText}>{description}</p>
      </div>

      <div data-dialog-footer className={styles.footer}>
        <div data-dialog-actions className={styles.actions}>
          <Button
            variant="outlined"
            color="primary"
            disableElevation
            onClick={onCancel}
            className={styles.outlined}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onSubmit}
            disableElevation
            disabled={!onSubmit}
            data-test-id={`confirm-button-${type}`}
            className={cx(styles.contained, {
              [styles.destructive]: type === "destructive",
            })}
          >
            {confirmLabel || "Confirm"}
          </Button>
        </div>
      </div>
    </MUIDialog>
  )
})

export default ConfirmationModal

const styles = {
  dialog: css`
    .MuiDialog-paper {
      margin: auto;
      min-width: 450px;
      
      @media (max-width: 500px) {
        min-width: 300px;
        margin: 16px;
      }
    }
  `,
  header: css`
    padding: 24px 24px 8px 24px;
    display: flex;
    align-items: center;
    font-size: 18px;
  `,
  title: css`
    margin: 0;
    line-height: 22px;
    font-size: 18px;
  `,
  close: css`
    top: 8px;
    right: 8px;
    position: absolute;
  `,
  content: css`
    padding: 0 24px;
  `,
  contentText: css`
    font-size: 14px;
  `,
  icon: css`
    width: 24px;
    height: 24px;
  `,
  footer: css`
    padding: 0 24px 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,
  actions: css`
    --gap: 8px;
    > *:not(:last-child) {
      margin-inline-end: var(--gap);
    }
  `,
  outlined: css`
    color: black;
    border: 1px solid rgba(0, 0, 0, 0.5);
    text-transform: capitalize;
    font-size: 13px;
  `,
  contained: css`
    background-color: var(--primary-main);
    color: white;
    text-transform: capitalize;
    font-size: 13px;
  `,
  destructive: css`
    background-color: var(--red);
    &:hover {
      background-color: var(--light-red);
    }
    &:disabled {
      background-color: rgba(239, 68, 68, 0.3);
      color: rgba(255, 255, 255, 0.5);
    }
  `,
}
