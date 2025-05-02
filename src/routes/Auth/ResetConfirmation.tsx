import { Button } from "@mui/material"
import { css } from "@emotion/css"
import { useNavigate } from "react-router-dom"

export function ResetConfirmation() {
  const navigate = useNavigate()

  const handleClick = () => navigate("/login")

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.firstLine}>Check your mail</div>
        <div className={styles.secondLine}>
          We have sent a password recover instructions to your email.
        </div>
      </div>
      <Button className={styles.btn} onClick={handleClick}>
        Back to Login
      </Button>
    </div>
  )
}

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    height: 325px;
    justify-content: space-between;
    align-items: center;
  `,
  firstLine: css`
    font-size: 32px;
    text-align: center;
    color: var(--primary-main);
  `,
  secondLine: css`
    font-size: 16px;
    color: var(--dark-grey);
    padding-top: 32px;
    text-align: center;
  `,
  btn: css`
    color: var(--primary-main);
    padding: 0;
    text-transform: none;
    min-width: fit-content;
    :hover {
      background-color: transparent;
      color: var(--primary-dark);
    }
  `,
}
