import React, { ChangeEvent } from "react"
import { doc, setDoc, updateDoc, collection } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import MUIDialog from "@material-ui/core/Dialog"
import IconButton from "@material-ui/core/IconButton"
import CloseIcon from "@material-ui/icons/Close"
import AccountBoxIcon from "@material-ui/icons/AccountBox"
import PhoneIcon from "@material-ui/icons/Phone"
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone"
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail"
import CakeIcon from "@material-ui/icons/Cake"
import { css } from "@emotion/css"
import { Button, FormControl } from "@material-ui/core"
import { TextInput } from "./inputs/TextInput"
import { Contact } from "models/contact"
import { DateInput } from "./inputs/DateInput"
import { db } from "firebase/fbConfig"
import { v1 as getUuid } from "uuid"
import Nameday from "components/Nameday"

type Props = {
  open: boolean
  onClose: VoidFunction
  type: "contact" | "connection"
  contact?: Contact
}

const contactFields = [
  { label: "First Name", value: "firstName", icon: AccountBoxIcon },
  { label: "Last Name", value: "lastName", icon: AccountBoxIcon },
  { label: "Phone", value: "phone", icon: PhoneIcon },
  { label: "Mobile", value: "mobile", icon: PhoneIphoneIcon },
  { label: "Email", value: "email", icon: AlternateEmailIcon },
]

const AddContact = (props: Props) => {
  const { open, onClose, type, contact } = props
  const [state, setState] = React.useState<Contact>({})
  const [errors, setErrors] = React.useState<Record<string, string>>()
  const auth = getAuth()
  const { currentUser } = auth

  const handleChange = (
    evt: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = evt.target
    setState((s) => ({ ...s, [name]: value }))
  }

  const handleDateChange = (date: Date | null, name: string) => {
    setState((s) => ({ ...s, [name]: date?.toISOString() }))
  }

  const handleSelectChange = (contact?: Contact) => setState(contact || {})

  const handleSubmit = () => {
    const updatedContact = {
      ...contact,
      connections: [
        ...(contact?.connections || []),
        { ...state, id: getUuid() },
      ],
    }
    !!contact
      ? updateDoc(
          doc(db, `users/${currentUser?.uid}/contacts/${contact?.id}`),
          updatedContact
        ).catch((err) => setErrors(err))
      : setDoc(doc(collection(db, `users/${currentUser?.uid}/contacts`)), {
          ...state,
          connections: [],
        }).catch((err) => setErrors(err))
    handleClose()
  }

  const handleClose = () => {
    setState({})
    onClose()
  }

  const id = "create-new-contact"
  return (
    <MUIDialog
      open={open}
      onClose={handleClose}
      id={id}
      disableEscapeKeyDown
      fullWidth
      maxWidth="xs"
    >
      <div data-dialog-header className={styles.header}>
        <div id={id} className={styles.title}>
          {`Add a new ${type}`}
        </div>
        <div data-dialog-close-button className={styles.close}>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon className={styles.icon} />
          </IconButton>
        </div>
      </div>

      <div data-dialog-content className={styles.content}>
        <FormControl fullWidth>
          {contactFields.map((cf, idx) => {
            const Cmp = cf?.icon
            return (
              <TextInput
                key={idx}
                name={cf?.value}
                label={cf?.label}
                placeholder={cf?.label}
                value={state[cf?.value as keyof Contact] || ""}
                onChange={handleChange}
                error={!!errors && !!errors[cf?.value]}
                errorMessage={!!errors ? errors[cf?.value] : ""}
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
            contact={state}
            hasError={() => !!errors && !!errors["nameday"]}
            errorMsg={() => (!!errors ? errors["nameday"] : "")}
            onContactChange={handleSelectChange}
            margin="normal"
            size="medium"
          />
        </FormControl>
      </div>
      <div data-dialog-footer className={styles.footer}>
        <div data-dialog-actions className={styles.actions}>
          <Button
            variant="outlined"
            disableElevation
            onClick={handleClose}
            size="large"
            className={styles.outlined}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            form="new_contact"
            disableElevation
            size="large"
            onClick={handleSubmit}
            disabled={!state["firstName"]}
            classes={{ containedSizeLarge: styles.contained }}
          >
            Submit
          </Button>
        </div>
      </div>
    </MUIDialog>
  )
}

export default AddContact

const styles = {
  header: css`
    padding: 24px 24px 8px 24px;
    display: flex;
    align-items: center;
    font-size: 18px;
  `,
  title: css`
    margin: 0;
    line-height: 22px;
    font-size: 18px;
  `,
  close: css`
    top: 8px;
    right: 8px;
    position: absolute;
  `,
  icon: css`
    width: 24px;
    height: 24px;
  `,
  content: css`
    padding: 24px;
    justify-content: center;
  `,
  footer: css`
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
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
  commonIcon: css`
    color: var(--primary-dark);
  `,
}
