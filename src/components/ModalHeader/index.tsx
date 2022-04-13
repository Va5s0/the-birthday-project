import { css } from "emotion"
import IconButton from "@material-ui/core/IconButton"
import CloseIcon from "@material-ui/icons/Close"

type Props = {
  id: string
  title: string
  onClose: VoidFunction
}

export const ModalHeader = (props: Props) => {
  const { id, title, onClose } = props
  return (
    <div data-dialog-header className={styles.header}>
      <div id={id} className={styles.title}>
        {title} {/* {`Add a new ${type}`} */}
      </div>
      <div data-dialog-close-button>
        <IconButton
          aria-label="close"
          onClick={onClose}
          className={styles.close}
        >
          <CloseIcon className={styles.icon} />
        </IconButton>
      </div>
    </div>
  )
}

const styles = {
  header: css`
    padding: 8px 12px 8px 24px;
    display: flex;
    align-items: center;
    font-size: 18px;
    background-color: var(--secondary-dark);
    justify-content: space-between;
  `,
  title: css`
    margin: 0;
    line-height: 22px;
    font-size: 18px;
    color: var(--white);
  `,
  close: css`
    color: var(--white);
  `,
  icon: css`
    width: 24px;
    height: 24px;
  `,
}
