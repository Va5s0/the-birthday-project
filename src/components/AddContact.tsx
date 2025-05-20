import React, { ChangeEvent } from "react"
import { doc, setDoc, updateDoc, collection } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import MUIDialog from "@mui/material/Dialog"
import CakeIcon from "@mui/icons-material/Cake"
import { css } from "@emotion/css"
import { Button, FormControl } from "@mui/material"
import { TextInput } from "./inputs/TextInput"
import { Contact } from "../models/contact"
import { DateInput } from "./inputs/DateInput"
import { db } from "../firebase/fbConfig"
import { v1 as getUuid } from "uuid"
import Nameday from "../components/Nameday"
import { ModalHeader } from "./ModalHeader"
import { nameFields, contactFields } from "../utils/contactFields"

type Props = {
  open: boolean
  onClose: VoidFunction
  type: "contact" | "connection"
  contact?: Contact
}

const AddContact = (props: Props) => {
  const { open, onClose, type, contact } = props
  const [state, setState] = React.useState<Partial<Contact>>({
    id: "",
    firstName: "",
    lastName: "",
  })
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
    if (date instanceof Date && !isNaN(date.getTime())) {
      setState((s) => ({ ...s, [name]: date.toISOString() }))
    } else {
      setState((s) => ({ ...s, [name]: null }))
    }
  }

  const handleSubmit = async () => {
    try {
      if (contact) {
        // Adding a connection to existing contact
        const updatedContact = {
          ...contact,
          connections: [
            ...(contact?.connections || []),
            { ...state, id: getUuid() },
          ],
        }
        await updateDoc(
          doc(db, `users/${currentUser?.uid}/contacts/${contact?.id}`),
          updatedContact
        )
      } else {
        // Creating a new contact
        const docRef = doc(collection(db, `users/${currentUser?.uid}/contacts`))
        await setDoc(docRef, {
          ...state,
          id: docRef.id,
          connections: [],
        })
      }
      handleClose()
    } catch (err: any) {
      setErrors(err)
    }
  }

  const handleClose = () => {
    setState({ id: "", firstName: "", lastName: "" })
    onClose()
  }

  const fields =
    type === "connection" ? nameFields : [...nameFields, ...contactFields]

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
      <ModalHeader id={id} title={`Add a new ${type}`} onClose={handleClose} />

      <div data-dialog-content className={styles.content}>
        <FormControl fullWidth>
          {fields.map((cf, idx) => {
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
                margin="normal"
                size="medium"
                variant="outlined"
              />
            )
          })}
          <DateInput
            name="birthday"
            label="Birthday"
            placeholder="Birthday"
            value={state?.birthday || ""}
            onChange={handleDateChange}
            icon={<CakeIcon className={styles.commonIcon} />}
            disableFuture
            margin="normal"
            size="medium"
          />
          <Nameday
            contact={state}
            hasError={() => !!errors && !!errors["nameday"]}
            errorMsg={() => (!!errors ? errors["nameday"] : "")}
            onContactChange={(updatedContact?: Partial<Contact>) =>
              setState(updatedContact ?? {})
            }
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
  content: css`
    padding: 0 24px;
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
    &.MuiSvgIcon-root {
      width: 20px;
      height: 20px;
    }
  `,
}
