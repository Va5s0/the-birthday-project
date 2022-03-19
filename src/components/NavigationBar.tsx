import { css } from "emotion"
import { AppBar, Box } from "@material-ui/core"

const NavigationBar = () => (
  <Box className={styles.container}>
    <AppBar position="static" className={styles.navbar}>
      <div className={styles.brand}>The Birthday Project</div>
    </AppBar>
  </Box>
)

export default NavigationBar

const styles = {
  container: css`
    display: flex;
    height: 80px;
    align-items: center;
  `,
  navbar: css`
    background-color: transparent;
    box-shadow: none;
  `,
  brand: css`
    color: var(--dark-grey-2);
    font-size: 24px;
  `,
}
