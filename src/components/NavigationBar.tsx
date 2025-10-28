import React from "react"
import {
  AppBar,
  Button,
  Fab,
  Toolbar,
  Typography,
  Avatar,
  Box,
} from "@mui/material"
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
import { doc, getDoc } from "firebase/firestore"
import { db } from "src/firebase/fbConfig"
import ConfirmationModal, { ModalInfo } from "./ConfirmationModal"
import { storage } from "src/firebase/fbConfig"
import { ref } from "firebase/storage"
import { SnackBar } from "./SnackBar"
import { ThemeToggle } from "./ThemeToggle"
import { getInitials, getAvatarColor } from "../utils/avatar"

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
  const [, setUserData] = React.useState<any>(null)

  const [modalInfo, setModalInfo] = React.useState<ModalInfo>()

  const userStorageRef = ref(storage, `users/${user?.uid}/user/avatar.jpg`)

  const onEditProfile = () => {
    navigate("/profile")
  }

  const onLogout = async () => {
    if (logout) await logout()
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

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return
      try {
        const userRef = doc(db, "users", user.uid)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          setUserData(userSnap.data())
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }
    fetchUserData()
  }, [user?.uid])

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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              color="inherit"
              onClick={() => navigate("/")}
              className={styles.title}
            >
              <Typography variant="h4" className={styles.titleText}>
                Birthday Project
              </Typography>
            </Button>
          </motion.div>

          <Box className={styles.rightSection}>
            <ThemeToggle />

            <div className={styles.profileSection}>
              <Typography variant="body2" className={styles.userName}>
                {user?.displayName || user?.email}
              </Typography>

              <Avatar
                src={!hasNoAvatar ? user?.photoURL ?? "" : undefined}
                alt="profile"
                className={styles.avatar}
                sx={{
                  width: 40,
                  height: 40,
                  ...(hasNoAvatar &&
                    (() => {
                      const nameParts = user?.displayName?.split(" ") || []
                      const firstName = nameParts[0]
                      const lastName = nameParts[1]
                      return getAvatarColor(firstName, lastName)
                    })()),
                }}
              >
                {hasNoAvatar &&
                  (() => {
                    const nameParts = user?.displayName?.split(" ") || []
                    const firstName = nameParts[0]
                    const lastName = nameParts[1]
                    return getInitials(firstName, lastName)
                  })()}
              </Avatar>

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
          </Box>
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
    background: var(--primary-main);
    color: var(--text-inverse);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: background-color 0.15s ease, box-shadow 0.15s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 1;
      transition: opacity 0.2s ease;
      pointer-events: none;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%,
        rgba(255, 255, 255, 0.05) 100%
      );
      pointer-events: none;
      z-index: 1;
    }

    /* Hide gradients during theme transition */
    .theme-transitioning & {
      &::before,
      &::after {
        opacity: 0 !important;
        transition: none !important;
      }
    }
  `,
  toolbar: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    min-height: 72px;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    position: relative;
    z-index: 2;
  `,
  titleContainer: css`
    display: flex;
    align-items: center;
    cursor: pointer;
  `,
  title: css`
    padding: 12px 16px;
    border-radius: 16px;
    transition: all 0.3s ease;
    text-transform: none;
    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }
  `,
  titleText: css`
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-weight: 700;
    font-size: 1.5rem;
    letter-spacing: -0.5px;
    line-height: 1.2;
    text-transform: none;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  `,
  rightSection: css`
    display: flex;
    align-items: center;
    gap: 16px;
  `,
  profileSection: css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }
  `,
  userName: css`
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    font-size: 0.875rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  `,
  avatar: css`
    border: 2px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    &:hover {
      border-color: rgba(255, 255, 255, 0.5);
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
  `,
  addButtonWrapper: css`
    position: fixed;
    right: 32px;
    bottom: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 1300;
  `,
  addButton: css`
    pointer-events: auto;
    background: linear-gradient(
      135deg,
      var(--primary-main) 0%,
      var(--primary-light) 100%
    );
    color: var(--text-inverse);
    box-shadow: var(--shadow-lg);
    transform-origin: center;
    border: none;
    width: 64px;
    height: 64px;
    &:hover {
      background: linear-gradient(
        135deg,
        var(--primary-dark) 0%,
        var(--primary-main) 100%
      );
      box-shadow: var(--shadow-xl);
      transform: translateY(-2px);
    }
    &:active {
      transform: translateY(0) scale(0.95);
    }
  `,
  icon: css`
    color: var(--text-primary);
    font-size: 1.25rem;
  `,
}
