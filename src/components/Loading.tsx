import CircularProgress from "@mui/material/CircularProgress"
import { css } from "@emotion/css"

export const Loading = () => (
  <div className={styles.container}>
    <CircularProgress />
  </div>
)

const styles = {
  container: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  `,
}
