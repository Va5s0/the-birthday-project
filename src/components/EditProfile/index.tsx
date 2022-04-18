import React, { ChangeEvent } from "react"
import { css } from "emotion"
import { doc, setDoc, onSnapshot, FirestoreError } from "firebase/firestore"
import { db } from "firebase/fbConfig"
import { Button, Fab, FormControl } from "@material-ui/core"
import CakeIcon from "@material-ui/icons/Cake"
import AccountCircleSharpIcon from "@material-ui/icons/AccountCircleSharp"
import AddAPhotoSharpIcon from "@material-ui/icons/AddAPhotoSharp"
import CloseIcon from "@material-ui/icons/Close"
import { TextInput } from "components/inputs/TextInput"
import Nameday from "components/Nameday"
import { DateInput } from "components/inputs/DateInput"
import { contactFields } from "utils/contactFields"
import { Contact } from "models/contact"
import { useAuth } from "context/AuthContext"
import { useHistory } from "react-router-dom"
import { getStorage, ref } from "firebase/storage"
import img from "assets/tree.jpeg"

export const EditProfile = () => {
  const history = useHistory()
  const {
    user,
    editProfile = () => {},
    upload = async () => {},
    fetchFile = () => {},
    deleteFile = () => {},
    error,
  } = useAuth() ?? {}
  const storage = getStorage()
  const userStorageRef = ref(storage, `${user?.uid}/user/avatar`)

  const [state, setState] = React.useState<Contact>()
  const [, setError] = React.useState<FirestoreError>()

  const handleChange = (
    evt: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = evt.target
    setState((s) => ({ ...s, [name]: value }))
  }

  const handleDateChange = (date: Date | null, name: string) => {
    setState((s) => ({ ...s, [name]: date?.toISOString() }))
  }

  const handleSelectChange = (profile?: Contact) => setState(profile || {})

  const handleCancel = () => history.push("/")

  const handleSubmit = () => {
    !!user &&
      editProfile(user, {
        displayName: state?.firstName || "",
        photoURL: user.photoURL || "",
      })
    setDoc(doc(db, `users/${user?.uid}/user`, "profile"), {
      ...state,
      connections: [],
    }).catch((err) => setError(err))
  }

  const handleSubmitFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event
    target.files?.length &&
      upload(userStorageRef, target.files[0]).then(() =>
        fetchFile(id, userStorageRef)
      )
    !!user &&
      editProfile(user, {
        displayName: user?.displayName || "",
        photoURL: userStorageRef.fullPath || "",
      })
  }

  const handleDeleteFile = () => {
    deleteFile(userStorageRef)
    !!user &&
      editProfile(user, {
        displayName: user?.displayName || "",
        photoURL: "",
      })
  }

  const docRef = doc(db, `users/${user?.uid}/user/profile`)

  const hasNoAvatar =
    error?.code === "storage/object-not-found" || error?.code === 403

  React.useEffect(
    () =>
      onSnapshot(
        docRef,
        (snapshot) => {
          const _user = snapshot.data()
          setState(_user)
        },
        (err) => {
          setError(err)
        }
      ),
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  )

  React.useEffect(() => {
    fetchFile(id, userStorageRef)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const id = "profileImg"
  return (
    <div className={styles.container}>
      <FormControl fullWidth className={styles.grid}>
        <form
          encType="form-data"
          method="POST"
          action="/upload"
          className={styles.imgUploadForm}
        >
          <div className={styles.imageUpload}>
            <label htmlFor="file-input">
              <div className={styles.fab}>
                <AddAPhotoSharpIcon />
              </div>
            </label>
            <input id="file-input" type="file" onChange={handleSubmitFile} />
          </div>
          {!hasNoAvatar ? (
            <div className={styles.profileContainer}>
              <Fab className="deletePhoto">
                <CloseIcon
                  className={styles.closeIcon}
                  onClick={handleDeleteFile}
                />
              </Fab>
              <img
                id={id}
                alt="profile"
                width={167}
                height={167}
                className={styles.profileImg}
              />
            </div>
          ) : (
            <AccountCircleSharpIcon className={styles.avatar} />
          )}
        </form>
        {contactFields.map((cf, idx) => {
          const Cmp = cf?.icon
          return (
            <TextInput
              key={idx}
              name={cf?.value}
              label={cf?.label}
              placeholder={cf?.label}
              value={!!state ? state[cf?.value as keyof Contact] || "" : ""}
              onChange={handleChange}
              // error={!!error && !!error[cf?.value]}
              // errorMessage={!!errors ? errors[cf?.value] : ""}
              icon={<Cmp className={styles.commonIcon} />}
              className="input"
            />
          )
        })}
        <DateInput
          name="birthday"
          label={"Birthday"}
          placeholder={"Birthday"}
          value={state?.birthday || ""}
          onChange={handleDateChange}
          icon={<CakeIcon />}
          disableFuture
          className="input"
        />
        <Nameday
          contact={state || {}}
          // hasError={() => !!errors && !!errors["nameday"]}
          // errorMsg={() => (!!errors ? errors["nameday"] : "")}
          onContactChange={handleSelectChange}
          margin="normal"
          size="medium"
          className="input"
        />
      </FormControl>
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
          form="new_contact"
          disableElevation
          size="large"
          onClick={handleSubmit}
          disabled={!state || !state["firstName"]}
          classes={{ containedSizeLarge: styles.contained }}
        >
          Save
        </Button>
      </div>
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
      background-image: url(${img});
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
    grid-template-rows: repeat(7, 1fr);
    .input:nth-child(5),
    .input:nth-child(6),
    .input:nth-child(7),
    .input:nth-child(8) {
      grid-column-start: 1;
      grid-column-end: 3;
    }
  `,
  imgUploadForm: css`
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
}
