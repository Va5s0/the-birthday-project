import React, { ChangeEvent } from "react"
import { css } from "@emotion/css"
import { getStorage, ref, getDownloadURL } from "firebase/storage"
import { Button, Fab, Grid, Paper, Typography } from "@mui/material"
import AddAPhotoSharpIcon from "@mui/icons-material/AddAPhotoSharp"
import CakeIcon from "@mui/icons-material/Cake"
import PhoneIcon from "@mui/icons-material/Phone"
import CloseIcon from "@mui/icons-material/Close"
import PersonIcon from "@mui/icons-material/Person"
import { IconButton, CircularProgress } from "@mui/material"
import { TextInput } from "../../components/inputs/TextInput"
import { Contact } from "../../models/contact"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import ConfirmationModal, {
  ModalInfo,
} from "../../components/ConfirmationModal"
import { DateInput } from "../inputs/DateInput"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "src/firebase/fbConfig"
import { getInitials, getAvatarColor } from "../../utils/avatar"
import Nameday from "../Nameday"

export const EditProfile = () => {
  const navigate = useNavigate()
  const {
    user,
    editProfile = () => {},
    deleteFile = () => {},
    error,
    file,
    upload = () => {},
  } = useAuth() ?? {}
  const storage = getStorage()

  const [state, setState] = React.useState<Partial<Contact>>({})
  const [isUploading, setIsUploading] = React.useState(false)
  // const [, setError] = React.useState<FirestoreError>()
  const [modalInfo, setModalInfo] = React.useState<ModalInfo>()

  const handleChange = (
    evt: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = evt.target
    setState((s) => ({ ...s, [name]: value }))
  }

  const handleAvatarChange = async (url: string | null | undefined) => {
    const updated = { ...state, photoURL: url }
    setState(updated)
  }

  const handleDateChange = (date: Date | null, name: string) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setState((s) => ({ ...s, [name]: date.toISOString() }))
    } else {
      setState((s) => ({ ...s, [name]: "" }))
    }
  }

  const handleCancel = () => navigate("/")

  const handleSubmit = async () => {
    if (!state || !user) return
    await editProfile(state) // Updates Auth profile (displayName, photoURL)
    // Save extra fields to Firestore
    await updateDoc(doc(db, "users", user.uid), {
      ...state,
    })
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB")
      return
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Invalid file type. Only JPEG and PNG are allowed.")
      return
    }

    try {
      setIsUploading(true)
      const storageRef = ref(storage, `users/${user?.uid}/user/avatar.jpg`)

      await upload(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      handleAvatarChange(downloadURL)
      // Update Auth profile
      if (user) {
        await editProfile({
          firstName: state?.firstName,
          lastName: state?.lastName,
          photoURL: downloadURL,
        })
        // Optionally update Firestore
        await updateDoc(doc(db, "users", user.uid), { photoURL: downloadURL })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const isModalOpen = Boolean(modalInfo)

  const onDelete = async () =>
    setModalInfo({
      title: "Delete Profile Picture",
      type: "destructive",
      description: "Are you sure you want to delete your profile picture?",
      confirmLabel: "Delete",
      onSubmit: handleDeleteFile,
    })

  const handleDeleteFile = async () => {
    await deleteFile(userStorageRef)
    setModalInfo(undefined)
  }

  const userStorageRef = ref(storage, `users/${user?.uid}/user/avatar.jpg`)

  React.useEffect(() => {
    const fetchUser = async () => {
      if (!user?.uid) return
      const userRef = doc(db, `users/${user.uid}`)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        const data = userSnap.data()
        setState(() => ({
          firstName: user?.displayName?.split(" ")[0] || "",
          lastName: user?.displayName?.split(" ")[1] || "",
          photoURL: user?.photoURL,
          phoneNumber: data?.phoneNumber || "",
          email: user?.email || "",
          birthday: data.birthday || "",
          nameday: data.nameday || undefined,
        }))
      }
    }
    fetchUser()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, user])

  const hasNoAvatar =
    error?.code === "storage/object-not-found" || error?.code === 403

  const id = "profileImg"

  // Display logic for header
  const firstName = state.firstName || ""
  const lastName = state.lastName || ""
  const fullName = `${firstName} ${lastName}`.trim()
  const displayName = fullName || state.email || user?.email || "Edit Profile"

  // Generate initials and colors for avatar
  const initials = getInitials(firstName, lastName)
  const { background, color } = getAvatarColor(firstName, lastName)

  return (
    <div className={styles.container}>
      <Paper className={styles.paper}>
        <Typography variant="h4" className={styles.title}>
          {displayName}
        </Typography>

        <Grid container spacing={4}>
          {/* Profile Picture Section */}
          <Grid item xs={12} className={styles.avatarSection}>
            {isUploading ? (
              <div className={styles.imgUploadWrapper}>
                <CircularProgress size={24} color="inherit" />
              </div>
            ) : (
              <div className={styles.imgUploadWrapper}>
                <div className={styles.imageUpload}>
                  <label htmlFor="file-input">
                    <IconButton
                      component="span"
                      disabled={isUploading}
                      className={styles.fab}
                    >
                      <AddAPhotoSharpIcon />
                    </IconButton>
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                {!hasNoAvatar ? (
                  <div className={styles.profileContainer}>
                    <Fab className="deletePhoto">
                      <CloseIcon
                        className={styles.closeIcon}
                        onClick={onDelete}
                      />
                    </Fab>
                    <img
                      id={id}
                      src={state.photoURL ?? ""}
                      alt="profile"
                      width={167}
                      height={167}
                      className={styles.profileImg}
                    />
                  </div>
                ) : (
                  <div
                    className={styles.initialsAvatar}
                    style={{
                      background,
                      color,
                    }}
                  >
                    {initials}
                  </div>
                )}
              </div>
            )}
          </Grid>

          {/* Name Fields */}
          <Grid item xs={12} sm={6}>
            <TextInput
              name="firstName"
              label="First Name"
              value={firstName}
              onChange={handleChange}
              icon={<PersonIcon className={styles.fieldIcon} />}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextInput
              name="lastName"
              label="Last Name"
              value={lastName}
              onChange={handleChange}
              icon={<PersonIcon className={styles.fieldIcon} />}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>

          {/* Contact Fields */}
          <Grid item xs={12} sm={6}>
            <TextInput
              name="phoneNumber"
              label="Phone"
              value={state.phoneNumber || ""}
              onChange={handleChange}
              icon={<PhoneIcon className={styles.fieldIcon} />}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>

          {/* Date Fields */}
          <Grid item xs={12} sm={6}>
            <DateInput
              name="birthday"
              label="Birthday"
              value={state.birthday || ""}
              onChange={handleDateChange}
              error={false}
              errorMessage={""}
              icon={<CakeIcon className={styles.fieldIcon} />}
              fullWidth
              disableFuture
              size="small"
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Nameday
              contact={state}
              hasError={() => false}
              errorMsg={() => ""}
              onContactChange={(updatedContact?: Partial<Contact>) =>
                setState(
                  updatedContact ? { ...state, ...updatedContact } : state
                )
              }
              margin="dense"
              size="small"
              className={styles.fullWidth}
            />
          </Grid>
        </Grid>

        <div className={styles.actions}>
          <Button
            onClick={handleCancel}
            color="inherit"
            className={styles.cancelButton}
          >
            Go back
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            className={styles.saveButton}
            disabled={!firstName}
          >
            Save Changes
          </Button>
        </div>
      </Paper>

      <ConfirmationModal
        open={isModalOpen}
        onCancel={() => setModalInfo(undefined)}
        {...modalInfo}
      />
    </div>
  )
}

const styles = {
  container: css`
    padding: 40px 24px;
    background-color: var(--bg-primary);
    min-height: calc(100vh - 70px);
    display: flex;
    justify-content: center;
    align-items: flex-start;
  `,
  paper: css`
    padding: 32px;
    border-radius: 16px;
    background: var(--bg-surface);
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15), 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    max-width: 800px;
    width: 100%;
    margin-top: 40px;
  `,
  title: css`
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 32px;
    text-align: center;
  `,
  avatarSection: css`
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
  `,
  imgUploadWrapper: css`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  `,
  imageUpload: css`
    position: absolute;
    right: -10px;
    bottom: 10px;
    z-index: 2;
    > label {
      cursor: pointer;
    }
    > input {
      display: none;
    }
  `,
  profileImg: css`
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `,
  fab: css`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-main);
    color: var(--white);
    width: 48px;
    height: 48px;
    padding: 0;
    box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%),
      0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
    box-sizing: border-box;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 50%;

    &:hover {
      background-color: var(--primary-dark);
      transform: scale(1.05);
    }
  `,
  avatar: css`
    width: 167px;
    height: 167px;
    color: var(--primary-main);
    background-color: rgba(99, 102, 241, 0.1);
    border-radius: 50%;
    padding: 20px;
  `,
  initialsAvatar: css`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 42px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2),
      inset 0 0 0 3px rgba(255, 255, 255, 0.1);
    border: 3px solid transparent;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25),
        inset 0 0 0 3px rgba(255, 255, 255, 0.2);
    }
  `,
  fieldIcon: css`
    color: var(--primary-main);
    width: 20px;
    height: 20px;
  `,
  actions: css`
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--border-primary);
  `,
  cancelButton: css`
    padding: 10px 24px;
    font-weight: 500;
    color: var(--text-secondary);

    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }
  `,
  saveButton: css`
    padding: 10px 24px;
    font-weight: 600;
    background-color: var(--primary-main);

    &:hover {
      background-color: var(--primary-dark);
    }

    &:disabled {
      background-color: var(--text-tertiary);
      color: var(--text-secondary);
    }
  `,
  profileContainer: css`
    position: relative;

    .deletePhoto {
      width: 32px;
      height: 32px;
      min-height: unset;
      background-color: #ef4444;
      color: var(--white);
      position: absolute;
      right: 5px;
      top: 5px;
      opacity: 0;
      transition: opacity 0.3s ease;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);

      &:hover {
        background-color: #dc2626;
      }
    }

    &:hover .deletePhoto {
      opacity: 1;
    }
  `,
  closeIcon: css`
    width: 18px;
    height: 18px;
  `,
  fullWidth: css`
    width: 100%;
  `,
}
