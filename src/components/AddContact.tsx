import React, { ChangeEvent } from "react"
import { doc, setDoc } from "firebase/firestore"
import MUIDialog from "@material-ui/core/Dialog"
import IconButton from "@material-ui/core/IconButton"
import CloseIcon from "@material-ui/icons/Close"
import AccountBoxIcon from "@material-ui/icons/AccountBox"
import PhoneIcon from "@material-ui/icons/Phone"
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone"
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail"
import CakeIcon from "@material-ui/icons/Cake"
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar"
import { css } from "@emotion/css"
import { Button, FormControl } from "@material-ui/core"
import { TextInput } from "./inputs/TextInput"
import { Contact } from "models/contact"
import { DateInput } from "./inputs/DateInput"
import { db } from "firebase/config"
import { v1 as getUuid } from "uuid"

type Props = {
  open: boolean
  onClose: VoidFunction
}

const contactFields = [
  { label: "First Name", value: "firstName", icon: <AccountBoxIcon /> },
  { label: "Last Name", value: "lastName", icon: <AccountBoxIcon /> },
  { label: "Phone", value: "phone", icon: <PhoneIcon /> },
  { label: "Mobile", value: "mobile", icon: <PhoneIphoneIcon /> },
  { label: "Email", value: "email", icon: <AlternateEmailIcon /> },
]

const AddContact = (props: Props) => {
  const { open, onClose } = props
  const [contact, setContact] = React.useState<Contact>({})
  const [errors, setErrors] = React.useState<Record<string, string>>()

  const handleChange = (
    evt: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = evt.target
    setContact((c) => ({ ...c, [name]: value }))
  }

  const handleDateChange = (date: Date | null, name: string) => {
    setContact((c) => ({ ...c, [name]: date?.toISOString() }))
  }

  const handleSubmit = () => {
    const contactsRef = doc(db, "contacts", getUuid())
    setDoc(contactsRef, contact).catch((err) => setErrors(err))
    handleClose()
  }

  const handleClose = () => {
    setContact({})
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
          Add a new contact
        </div>
        <div data-dialog-close-button className={styles.close}>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon className={styles.icon} />
          </IconButton>
        </div>
      </div>

      <div data-dialog-content className={styles.content}>
        <FormControl fullWidth>
          {contactFields.map((cf, idx) => (
            <TextInput
              key={idx}
              name={cf?.value}
              label={cf?.label}
              placeholder={cf?.label}
              value={contact[cf?.value as keyof Contact] || ""}
              onChange={handleChange}
              error={!!errors && !!errors[cf?.value]}
              errorMessage={!!errors ? errors[cf?.value] : ""}
              icon={cf?.icon}
            />
          ))}
          <DateInput
            name="birthday"
            label={"Birthday"}
            placeholder={"Birthday"}
            value={contact?.birthday || ""}
            onChange={handleDateChange}
            icon={<CakeIcon />}
          />
          <DateInput
            name="nameday"
            label={"Nameday"}
            placeholder={"Nameday"}
            value={contact?.nameday?.date || ""}
            onChange={handleDateChange}
            icon={<PermContactCalendarIcon />}
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
    font-weight: bold;
  `,
  title: css`
    margin: 0;
    line-height: 22px;
    font-size: 24px;
    color: grey;
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
    background-color: #eee;
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
    background-color: grey;
    color: white;
    text-transform: capitalize;
    font-size: 13px;
  `,
}
