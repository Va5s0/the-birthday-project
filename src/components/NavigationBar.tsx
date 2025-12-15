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
import ConfirmationModal, { ModalInfo } from "./ConfirmationModal"
import { SnackBar } from "./SnackBar"
import { ThemeToggle } from "./ThemeToggle"
import { getInitials, getAvatarColor } from "../utils/avatar"
import { api } from "../services/api"
import { useContactPicker } from "../hooks/useContactPicker"
import ContactPhoneIcon from "@mui/icons-material/ContactPhone"

export const NavigationBar = () => {
  const { logout, user, userDelete, error, resetError } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const { importFromPhone, isImporting, isSupported } = useContactPicker()
  const [importMessage, setImportMessage] = useState<{
    text: string
    severity: "success" | "error"
  } | null>(null)

  // Debug logging
  React.useEffect(() => {
    console.log("=== Contact Picker Debug ===")
    console.log("isSupported:", isSupported)
    console.log("navigator.contacts exists:", "contacts" in navigator)
    console.log("navigator.contacts value:", (navigator as any).contacts)
    console.log("window.isSecureContext:", window.isSecureContext)
    console.log("window.location:", window.location.href)
    console.log("============================")
  }, [isSupported])

  const [modalInfo, setModalInfo] = React.useState<ModalInfo>()

  const onEditProfile = () => {
    navigate("/profile")
  }

  const onLogout = async () => {
    if (logout) await logout()
    navigate("/login")
  }

  const deleteUserAccount = async () => {
    try {
      await userDelete()
      navigate("/login", {
        state: {
          openSnackbar: true,
          message: "Your account has been successfully deleted",
          severity: "success",
        },
      })
    } catch (error) {
      console.error("Error deleting account:", error)
    } finally {
      setModalInfo(undefined)
    }
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
    resetError()
  }

  const handleImportFromPhone = async () => {
    const result = await importFromPhone()

    if (result.cancelled) {
      // User cancelled, do nothing
      return
    }

    if (result.success && result.count > 0) {
      setImportMessage({
        text: `Successfully imported ${result.count} contact${
          result.count > 1 ? "s" : ""
        }`,
        severity: "success",
      })
    } else if (!result.success) {
      setImportMessage({
        text: result.error || "Failed to import contacts",
        severity: "error",
      })
    }
  }

  const handleImportMessageClose = () => {
    setImportMessage(null)
  }

  const hasNoAvatar = !user?.avatarUrl
  const isModalOpen = Boolean(modalInfo)

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email || "User"

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
                {displayName}
              </Typography>

              <Avatar
                src={
                  !hasNoAvatar
                    ? api.getAvatarUrl(user?.avatarUrl) ?? ""
                    : undefined
                }
                alt="profile"
                className={styles.avatar}
                sx={{
                  ...(hasNoAvatar &&
                    getAvatarColor(
                      user?.firstName ?? undefined,
                      user?.lastName ?? undefined
                    )),
                }}
              >
                {hasNoAvatar &&
                  getInitials(
                    user?.firstName ?? undefined,
                    user?.lastName ?? undefined
                  )}
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
          {/* Temporarily always show for debugging */}
          {true && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={styles.importButtonContainer}
            >
              <Fab
                onClick={handleImportFromPhone}
                className={styles.importButton}
                aria-label="import from phone"
                disabled={isImporting || !isSupported}
                size="medium"
              >
                <ContactPhoneIcon />
              </Fab>
            </motion.div>
          )}
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
        open={!!error}
        onClose={handleSnackbarClose}
        message={error?.message || ""}
        severity={"error"}
      />
      <SnackBar
        open={!!importMessage}
        onClose={handleImportMessageClose}
        message={importMessage?.text || ""}
        severity={importMessage?.severity || "success"}
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
    position: sticky;
    top: 0;
    z-index: 1100;
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

    @media (max-width: 768px) {
      padding: 0 16px;
      min-height: 64px;
    }

    @media (max-width: 480px) {
      padding: 0 12px;
      min-height: 60px;
    }
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
      background-color: transparent;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      padding: 8px 12px;
      border-radius: 12px;
    }

    @media (max-width: 480px) {
      padding: 6px 8px;
      border-radius: 10px;
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

    @media (max-width: 768px) {
      font-size: 1.25rem;
      letter-spacing: -0.3px;
    }

    @media (max-width: 480px) {
      font-size: 1.1rem;
      letter-spacing: -0.2px;
    }
  `,
  rightSection: css`
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 768px) {
      gap: 12px;
    }

    @media (max-width: 480px) {
      gap: 8px;
    }
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

    @media (max-width: 768px) {
      gap: 8px;
      padding: 6px 12px;
      border-radius: 16px;
    }

    @media (max-width: 480px) {
      gap: 6px;
      padding: 4px 10px;
      border-radius: 14px;
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

    @media (max-width: 768px) {
      font-size: 0.8125rem;
      max-width: 120px;
    }

    @media (max-width: 480px) {
      display: none;
    }
  `,
  avatar: css`
    width: 40px;
    height: 40px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding-bottom: 4px;
    &:hover {
      border-color: rgba(255, 255, 255, 0.5);
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      width: 36px !important;
      height: 36px !important;
      font-size: 0.875rem;
    }

    @media (max-width: 480px) {
      width: 32px !important;
      height: 32px !important;
      font-size: 0.8125rem;
      border-width: 1.5px;
    }
  `,
  addButtonWrapper: css`
    position: fixed;
    right: 32px;
    bottom: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    pointer-events: none;
    z-index: 1300;

    @media (max-width: 768px) {
      right: 24px;
      bottom: 24px;
      gap: 10px;
    }

    @media (max-width: 480px) {
      right: 16px;
      bottom: 16px;
      gap: 8px;
    }
  `,
  importButtonContainer: css`
    pointer-events: auto;
  `,
  importButton: css`
    pointer-events: auto;
    background: linear-gradient(
      135deg,
      var(--secondary-main) 0%,
      var(--secondary-light) 100%
    );
    color: var(--text-inverse);
    box-shadow: var(--shadow-md);
    transform-origin: center;
    border: none;
    &:hover:not(:disabled) {
      background: linear-gradient(
        135deg,
        var(--secondary-dark) 0%,
        var(--secondary-main) 100%
      );
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }
    &:active:not(:disabled) {
      transform: translateY(0) scale(0.95);
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
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

    @media (max-width: 768px) {
      width: 56px;
      height: 56px;
    }

    @media (max-width: 480px) {
      width: 52px;
      height: 52px;
    }
  `,
  icon: css`
    color: var(--text-primary);
    font-size: 1.25rem;
  `,
}
