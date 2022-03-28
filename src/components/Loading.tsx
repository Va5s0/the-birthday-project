import { css } from "@emotion/css"
import CircularProgress from "@material-ui/core/CircularProgress"

export function Loading() {
  return (
    <div className={styles.root}>
      <CircularProgress />
    </div>
  )
}

const styles = {
  root: css`
    padding: 1.5rem;
    align-self: center;
    display: flex;
    justify-content: center;
  `,
}
