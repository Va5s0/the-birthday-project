import React from "react"
import { AppBar, Button, Fab, Toolbar, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import { css } from "@emotion/css"
import AddIcon from "@mui/icons-material/Add"
import EditSharpIcon from "@mui/icons-material/EditSharp"
import ExitToAppSharpIcon from "@mui/icons-material/ExitToAppSharp"
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp"
import AddContact from "./AddContact"
import { useState } from "react"
import { motion } from "framer-motion"
import MoreActions from "./MoreActions"
import { useAuth } from "src/context/AuthContext"
import ConfirmationModal, { ModalInfo } from "./ConfirmationModal"
import { storage } from "src/firebase/fbConfig"
import { ref } from "firebase/storage"
import { SnackBar } from "./SnackBar"

export const NavigationBar = () => {
  const {
    logout,
    user,
    userDelete,
    error,
    resetError,
    snackbar = true,
    fetchFile = () => {},
    file,
  } = useAuth() ?? {}
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const [modalInfo, setModalInfo] = React.useState<ModalInfo>()

  const userStorageRef = ref(storage, `users/${user?.uid}/user/avatar.jpg`)

  const onEditProfile = () => {
    navigate("/profile")
  }
  const onLogout = () => {
    logout && logout()
    navigate("/login")
  }

  const deleteUserAccount = async () => {
    const canIDelete =
      userDelete &&
      user &&
      (await userDelete(user).then((value) => value?.name !== "FirebaseError"))

    !!canIDelete &&
      navigate("/login", {
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

  React.useEffect(() => {
    !!user?.uid && fetchFile(id, userStorageRef)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, user])

  const hasNoAvatar =
    error?.code === "storage/object-not-found" || error?.code === 403
  const isModalOpen = Boolean(modalInfo)
  const id = "avatarImg"

  return (
    <>
      <AppBar position="sticky" className={styles.appBar} elevation={0}>
        <Toolbar className={styles.toolbar}>
          <motion.div
            className={styles.titleContainer}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              color="inherit"
              onClick={() => navigate("/")}
              className={styles.title}
            >
              <Typography variant="h4" className={styles.titleText}>
                The Birthday Project
              </Typography>
            </Button>
          </motion.div>
          <div className={styles.profileSection}>
            <span>{user?.displayName || user?.email}</span>
            {!hasNoAvatar ? (
              <img
                id={id}
                alt="profile"
                width={40}
                height={40}
                className={styles.profileImg}
              />
            ) : null}
            <MoreActions
              options={[
                // EDIT PROFILE
                {
                  label: "Edit profile",
                  icon: <EditSharpIcon className={styles.icon} />,
                  onClick: onEditProfile,
                },
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
        </Toolbar>
      </AppBar>
      {pathname !== "/profile" ? (
        <div className={styles.addButtonWrapper}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Fab
              onClick={() => setOpen(true)}
              className={styles.addButton}
              aria-label="add"
            >
              <AddIcon />
            </Fab>
            <AddContact
              open={open}
              onClose={() => setOpen(false)}
              type="contact"
            />
          </motion.div>
        </div>
      ) : null}
      <ConfirmationModal
        open={isModalOpen}
        onCancel={() => setModalInfo(undefined)}
        {...modalInfo}
      />
      <SnackBar
        open={snackbar && !!error}
        onClose={handleSnackbarClose}
        message={error?.message!}
        severity={"error"}
      />
    </>
  )
}

const styles = {
  appBar: css`
    background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%);
    color: white;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    display: flex;
    justify-content: center;
  `,
  toolbar: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    min-height: 64px;
  `,
  titleContainer: css`
    display: flex;
    align-items: center;
    cursor: pointer;
  `,
  title: css`
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
    &:hover {
      background-color: transparent;
      backdrop-filter: blur(5px);
    grid-column-gap: 10px;
    cursor: pointer;
    .logo {
      fill: var(--secondary-main);
    }
  `,
  titleText: css`
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-weight: 700;
    font-size: 1.75rem;
    letter-spacing: -0.5px;
    line-height: 1.2;
    text-transform: none;
    background: linear-gradient(to right, #ffffff, #e2e8f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  `,
  profileSection: css`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 18px 0 30px;
    grid-column-gap: 10px;
  `,
  addButtonWrapper: css`
    position: fixed;
    right: 50px;
    top: 92px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none; /* So only the button gets pointer events */
    z-index: 1300;
  `,
  addButton: css`
    pointer-events: auto;
    background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
    color: #9333ea;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform-origin: center;
    &:hover {
      background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
      box-shadow: 0 6px 8px rgba(147, 51, 234, 0.2);
    }
  `,
  icon: css`
    color: var(--dark-grey-3);
  `,
  profileImg: css`
    border-radius: 50%;
    margin-left: 20px;
  `,
}
