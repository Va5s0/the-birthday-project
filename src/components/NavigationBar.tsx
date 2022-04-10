import React from "react"
import { css } from "emotion"
import { AppBar, Fab } from "@material-ui/core"
import { useAuth } from "context/AuthContext"
import { useHistory } from "react-router-dom"
import AddIcon from "@material-ui/icons/Add"
import ExitToAppSharpIcon from "@material-ui/icons/ExitToAppSharp"
import DeleteForeverSharpIcon from "@material-ui/icons/DeleteForeverSharp"
import AddContact from "./AddContact"
import { ReactComponent as Tree } from "assets/tree.svg"
import MoreActions from "./MoreActions"
import ConfirmationModal, { ModalInfo } from "./ConfirmationModal"
import { SnackBar } from "./SnackBar"

const NavigationBar = () => {
  const { logout, user, userDelete, error, resetError } = useAuth() ?? {}
  const history = useHistory()
  const [openAdd, setOpenAdd] = React.useState<boolean>(false)
  const [modalInfo, setModalInfo] = React.useState<ModalInfo>()

  const onOpen = () => setOpenAdd(true)
  const onClose = () => setOpenAdd(false)

  const onLogout = () => {
    logout && logout()
    history.push("/login")
  }

  const deleteUserAccount = async () => {
    const canIDelete =
      userDelete &&
      user &&
      (await userDelete(user).then((value) => value?.name !== "FirebaseError"))

    !!canIDelete &&
      history.push({
        pathname: "/login",
        state: {
          openSnackbar: true,
          message: "Your account has been successfully deleted",
          severity: "success",
        },
      })
    setModalInfo(undefined)
  }

  const onDelete = () =>
    setModalInfo({
      title: "Delete Account",
      type: "destructive",
      description:
        "Are you sure you want to delete your account? This actions is not reversible.",
      confirmLabel: "Delete",
      onSubmit: deleteUserAccount,
    })

  const handleSnackbarClose = () => {
    resetError && resetError(undefined)
  }

  const isModalOpen = Boolean(modalInfo)

  return (
    <>
      <AppBar position="fixed" className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.brand}>
            <Tree className="logo" />
            The Birthday Project
          </div>
          <div className={styles.profileSection}>
            <span>{user?.displayName || user?.email}</span>
            <MoreActions
              options={[
                // LOGOUT
                {
                  label: "Logout",
                  icon: <ExitToAppSharpIcon className={styles.icon} />,
                  onClick: onLogout,
                },
                // DELETE
                {
                  label: "Delete account",
                  icon: <DeleteForeverSharpIcon className={styles.icon} />,
                  onClick: onDelete,
                },
              ]}
            />
          </div>
        </div>
      </AppBar>
      <Fab onClick={onOpen} className={styles.addButton} aria-label="add">
        <AddIcon />
      </Fab>
      <AddContact open={openAdd} onClose={onClose} type="contact" />
      <ConfirmationModal
        open={isModalOpen}
        onCancel={() => setModalInfo(undefined)}
        {...modalInfo}
      />
      <SnackBar
        open={!!error}
        onClose={handleSnackbarClose}
        message={error!}
        severity={"error"}
      />
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
  profileSection: css`
    display: flex;
    align-items: center;
    border-left: 1px solid var(--light-grey-4);
    border-radius: 0;
    height: 100%;
    padding: 0 18px 0 30px;
    grid-column-gap: 10px;
    color: var(--dark-grey-3);
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
  icon: css`
    color: var(--dark-grey-3);
  `,
}
