import { ReactNode } from "react"
import MUIDialog from "@material-ui/core/Dialog"
import { css, cx } from "@emotion/css"
import { Button, IconButton } from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"

export type ModalInfo =
  | {
      type?: "primary" | "destructive"
      title?: string
      description?: ReactNode
      onSubmit?: (e?: any) => void
      confirmLabel?: string
    }
  | undefined

type Props = ModalInfo & {
  open: boolean
  onCancel: (e?: any) => void
}

export default function ConfirmationModal(props: Props) {
  const { open, onCancel, title, description, confirmLabel, type, onSubmit } =
    props
  const id = "alert-dialog-title"

  const x = css`
    margin: auto;
    min-width: 450px;
  `
  return (
    <MUIDialog
      className={x}
      open={open}
      onClose={onCancel}
      id={id}
      maxWidth="sm"
    >
      <div data-dialog-header className={styles.header}>
        <div id={id} className={styles.title}>
          {title}
        </div>
        <div data-dialog-close-button className={styles.close}>
          <IconButton aria-label="close" onClick={onCancel}>
            <CloseIcon className={styles.icon} />
          </IconButton>
        </div>
      </div>

      <div data-dialog-content className={styles.content}>
        <p className={styles.contentText}>{description}</p>
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
            data-test-id={`delete-button-${type}`}
            className={cx(styles.contained, {
              [styles.destructive]: type === "destructive",
            })}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </MUIDialog>
  )
}

const styles = {
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
    padding: 24px;
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
    :hover {
      background-color: var(--light-red);
    }
  `,
}
