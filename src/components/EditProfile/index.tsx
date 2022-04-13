import React, { ChangeEvent } from "react"
import { css } from "emotion"
import { doc, setDoc, onSnapshot, FirestoreError } from "firebase/firestore"
import { db } from "firebase/fbConfig"
import { Button, FormControl } from "@material-ui/core"
import CakeIcon from "@material-ui/icons/Cake"
import { TextInput } from "components/inputs/TextInput"
import Nameday from "components/Nameday"
import { DateInput } from "components/inputs/DateInput"
import { contactFields } from "utils/contactFields"
import { Contact } from "models/contact"
import { useAuth } from "context/AuthContext"
import { useHistory } from "react-router-dom"

export const EditProfile = () => {
  const history = useHistory()
  const { user, editProfile } = useAuth() ?? {}

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
      !!editProfile &&
      editProfile(user, {
        displayName: state?.firstName || "",
        photoURL: "",
      })
    setDoc(doc(db, `users/${user?.uid}/user`, "profile"), {
      ...state,
      connections: [],
    }).catch((err) => setError(err))
  }

  const docRef = doc(db, `users/${user?.uid}/user/profile`)

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

  return (
    <>
      <div className={styles.container}>
        <FormControl fullWidth>
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
          />
          <Nameday
            contact={state || {}}
            // hasError={() => !!errors && !!errors["nameday"]}
            // errorMsg={() => (!!errors ? errors["nameday"] : "")}
            onContactChange={handleSelectChange}
            margin="normal"
            size="medium"
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
    </>
  )
}

const styles = {
  container: css`
    padding: 120px 35px 0;
  `,
  commonIcon: css`
    color: var(--primary-dark);
  `,
  actions: css`
    --gap: 8px;
    > *:not(:last-child) {
      margin-inline-end: var(--gap);
    }
  `,
  outlined: css`
    color: black;
    border: 1px solid rgba(0, 0, 0, 0.5);
    text-transform: capitalize;
    font-size: 13px;
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
}
