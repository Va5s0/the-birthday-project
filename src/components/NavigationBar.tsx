import React from "react"
import { css } from "emotion"
import { AppBar, Button, Fab } from "@material-ui/core"
import { useAuth } from "context/AuthContext"
import { useHistory } from "react-router-dom"
import AddIcon from "@material-ui/icons/Add"
import AddContact from "./AddContact"
import { ReactComponent as Tree } from "assets/tree.svg"

const NavigationBar = () => {
  const { logout } = useAuth() ?? {}
  const history = useHistory()
  const [openAdd, setOpenAdd] = React.useState<boolean>(false)

  const onOpen = () => setOpenAdd(true)
  const onClose = () => setOpenAdd(false)

  const handleClick = () => {
    logout && logout()
    history.push("/login")
  }
  return (
    <>
      <AppBar position="fixed" className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.brand}>
            <Tree className="logo" />
            {/* <div className="logo" /> */}
            The Birthday Project
          </div>
          <Button onClick={handleClick} className={styles.btn}>
            Logout
          </Button>
        </div>
      </AppBar>
      <Fab onClick={onOpen} className={styles.addButton} aria-label="add">
        <AddIcon />
      </Fab>
      <AddContact open={openAdd} onClose={onClose} type="contact" />
    </>
  )
}

export default NavigationBar

const styles = {
  wrapper: css`
    display: flex;
    justify-content: center;
    background-color: var(--white);
    box-shadow: none;
    height: 70px;
    border-bottom: 1px solid var(--light-grey-4);
  `,
  container: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    z-index: 100;
  `,
  brand: css`
    color: var(--dark-grey-3);
    font-size: 24px;
    padding: 0 50px;
    display: flex;
    align-items: center;
    grid-column-gap: 10px;
    .logo {
      fill: var(--secondary-main);
    }
  `,
  btn: css`
    font-size: 13px;
    font-weight: 600;
    border-left: 1px solid var(--light-grey-4);
    height: 100%;
    border-radius: 0;
    padding: 0 50px;
    :hover {
      background-color: transparent;
    }
  `,
  addButton: css`
    position: fixed;
    right: 50px;
    top: 92px;
    background-color: var(--primary-main);
    color: var(--white);
    z-index: 1000;
    :hover {
      background-color: var(--primary-dark);
    }
    > span > svg {
      font-size: 40px;
    }
  `,
}
