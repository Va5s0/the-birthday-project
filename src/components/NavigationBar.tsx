import { css } from "emotion"
import { Box, Button } from "@material-ui/core"
import { useAuth } from "context/AuthContext"
import { useHistory } from "react-router-dom"

const NavigationBar = () => {
  const { logout } = useAuth() ?? {}
  const history = useHistory()

  const handleClick = () => {
    logout && logout()
    history.push("/login")
  }
  return (
    <Box className={styles.container}>
      <div className={styles.brand}>The Birthday Project</div>
      <Button onClick={handleClick}>Logout</Button>
    </Box>
  )
}

export default NavigationBar

const styles = {
  container: css`
    display: flex;
    height: 80px;
    align-items: center;
    justify-content: space-between;
  `,
  brand: css`
    color: var(--dark-grey-2);
    font-size: 24px;
  `,
}
