import React, { ChangeEvent } from "react"
import { css } from "@emotion/css"
import { getStorage, ref, getDownloadURL } from "firebase/storage"
import { Button, Fab } from "@mui/material"
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp"
import AddAPhotoSharpIcon from "@mui/icons-material/AddAPhotoSharp"
import CakeIcon from "@mui/icons-material/Cake"
import PhoneIcon from "@mui/icons-material/Phone"
import CloseIcon from "@mui/icons-material/Close"
import { IconButton, CircularProgress } from "@mui/material"
import { TextInput } from "../../components/inputs/TextInput"
import { nameFields } from "../../utils/contactFields"
import { Contact } from "../../models/contact"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import ConfirmationModal, {
  ModalInfo,
} from "../../components/ConfirmationModal"
import { DateInput } from "../inputs/DateInput"
import Nameday from "../Nameday"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "src/firebase/fbConfig"

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
          firstName: user?.displayName?.split(" ")[0],
          lastName: user?.displayName?.split(" ")[1],
          photoURL: user?.photoURL,
          phoneNumber: data?.phoneNumber,
          email: user?.email,
          birthday: data.birthday,
          nameday: data.nameday ?? "",
        }))
      }
    }
    fetchUser()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, user])

  const hasNoAvatar =
    error?.code === "storage/object-not-found" || error?.code === 403

  const id = "profileImg"
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
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
              />{" "}
            </div>
            {!hasNoAvatar ? (
              <div className={styles.profileContainer}>
                <Fab className="deletePhoto">
                  <CloseIcon className={styles.closeIcon} onClick={onDelete} />
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
              <AccountCircleSharpIcon className={styles.avatar} />
            )}
          </div>
        )}
        {nameFields.map((cf, idx) => {
          const Cmp = cf?.icon
          return (
            <TextInput
              key={idx}
              name={cf?.value}
              label={cf?.label}
              placeholder={cf?.label}
              value={state[cf?.value as keyof Contact] || ""}
              onChange={handleChange}
              // error={!!error && !!error[cf?.value]}
              // errorMessage={!!errors ? errors[cf?.value] : ""}
              icon={<Cmp className={styles.commonIcon} />}
              className="input"
            />
          )
        })}
        <TextInput
          name="phoneNumber"
          label="Phone"
          placeholder="Phone"
          value={state["phoneNumber"] || ""}
          onChange={handleChange}
          // error={!!error && !!error[cf?.value]}
          // errorMessage={!!errors ? errors[cf?.value] : ""}
          icon={<PhoneIcon className={styles.commonIcon} />}
          className="input"
        />
        <DateInput
          name="birthday"
          label="Birthday"
          placeholder={"Birthday"}
          value={state?.birthday || ""}
          disableFuture
          margin="dense"
          size="small"
          onChange={handleDateChange}
          icon={<CakeIcon className={styles.commonIcon} />}
          className="input"
          // error={hasError(state?.birthday, index)}
          // errorMessage={errorMsg(state?.birthday, index)}
        />
        <Nameday
          contact={state}
          // hasError={hasError}
          // errorMsg={errorMsg}
          margin="dense"
          size="small"
          onContactChange={(updatedContact?: Partial<Contact>) =>
            setState(updatedContact ?? {})
          }
          className="input"
        />
      </div>
      <div className={styles.actions}>
        <Button
          variant="outlined"
          disableElevation
          onClick={handleCancel}
          size="large"
          className={styles.outlined}
        >
          Go back
        </Button>
        <Button
          variant="contained"
          type="submit"
          form="edit_contact"
          disableElevation
          size="large"
          onClick={handleSubmit}
          disabled={!state || !state["firstName"]}
          classes={{ containedSizeLarge: styles.contained }}
        >
          Save
        </Button>
      </div>
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
    padding: 120px 35px 0;
    background-color: var(--light-grey-3);
    min-height: calc(100vh - 70px);
    ::before {
      content: "";
      height: 100%;
      width: 100%;
      position: fixed;
      top: 10%;
      left: 25%;
      z-index: 0;
      opacity: 0.05;
      background-size: 800px;
      background-repeat: no-repeat;
    }
  `,
  grid: css`
    display: grid;
    grid-template-columns: max-content auto;
    grid-template-rows: repeat(5, 1fr);
    .input:nth-child(5),
    .input:nth-child(6),
    .input:nth-child(7),
    .input:nth-child(8) {
      grid-column-start: 1;
      grid-column-end: 3;
    }
  `,
  imgUploadWrapper: css`
    display: flex;
    align-items: center;
    justify-content: center;
    grid-row-start: 1;
    grid-row-end: 4;
    position: relative;
  `,
  imageUpload: css`
    position: absolute;
    right: 35px;
    bottom: 25px;
    > label {
      cursor: pointer;
    }
    > input {
      display: none;
    }
  `,
  profileImg: css`
    border-radius: 50%;
  `,
  fab: css`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-main);
    color: var(--white);
    width: 56px;
    height: 56px;
    padding: 0;
    box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%),
      0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
    box-sizing: border-box;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius: 50%;
    :hover {
      background-color: var(--primary-light);
    }
  `,
  avatar: css`
    width: 200px;
    height: 200px;
    color: var(--primary-dark);
  `,
  commonIcon: css`
    color: var(--primary-dark);
  `,
  actions: css`
    --gap: 8px;
    padding-top: 20px;
    text-align: right;
    > *:not(:last-child) {
      margin-inline-end: var(--gap);
    }
  `,
  outlined: css`
    color: black;
    border: 1px solid rgba(0, 0, 0, 0.5);
    text-transform: capitalize;
    font-size: 13px;
    background-color: var(--white);
  `,
  contained: css`
    background-color: var(--primary-main);
    color: white;
    text-transform: capitalize;
    font-size: 13px;
    :hover {
      background-color: var(--primary-dark);
    }
  `,
  profileContainer: css`
    .deletePhoto {
      width: 24px;
      height: 24px;
      min-height: unset;
      background-color: var(--red);
      color: var(--white);
      position: absolute;
      right: 35px;
      top: 25px;
      opacity: 0;
    }
    :hover {
      .deletePhoto {
        opacity: 1;
      }
    }
  `,
  closeIcon: css`
    width: 16px;
    height: 16px;
  `,
  avatarImage: css`
    border-radius: 50%;
    object-fit: cover;
  `,
  avatarIcon: css`
    width: 48px;
    height: 48px;
    color: var(--primary-main);
    background-color: rgba(147, 51, 234, 0.1);
    border-radius: 50%;
    padding: 8px;
    transition: all 0.3s ease;
    &:hover {
      transform: scale(1.05);
      background-color: rgba(147, 51, 234, 0.15);
    }
  `,
}
