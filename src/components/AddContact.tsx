import React, { ChangeEvent } from "react"
import { doc, setDoc, updateDoc, collection } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
} from "@mui/material"
import CakeIcon from "@mui/icons-material/Cake"
import { css } from "@emotion/css"
import { Button } from "@mui/material"
import { TextInput } from "./inputs/TextInput"
import { Contact } from "../models/contact"
import { DateInput } from "./inputs/DateInput"
import { db } from "../firebase/fbConfig"
import { v1 as getUuid } from "uuid"
import CloseIcon from "@mui/icons-material/Close"
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar"
import PersonIcon from "@mui/icons-material/Person"
import { contactFields } from "../utils/contactFields"

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
    setState((s) => ({ ...s, [name]: value?.trim() }))
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

  const modalTitle =
    type === "connection" ? "Add New Connection" : "Add New Contact"

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      className={styles.dialog}
    >
      <DialogTitle className={styles.title}>
        {modalTitle}
        <IconButton
          onClick={handleClose}
          className={styles.closeButton}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className={styles.content}>
        <Grid container spacing={3}>
          {/* Name Fields */}
          <Grid item xs={12} sm={6}>
            <TextInput
              name="firstName"
              label="First Name"
              value={state.firstName || ""}
              onChange={handleChange}
              error={!!errors?.firstName}
              errorMessage={errors?.firstName}
              icon={<PersonIcon className={styles.fieldIcon} />}
              fullWidth
              required
              size="small"
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextInput
              name="lastName"
              label="Last Name"
              value={state.lastName || ""}
              onChange={handleChange}
              error={!!errors?.lastName}
              errorMessage={errors?.lastName}
              icon={<PersonIcon className={styles.fieldIcon} />}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>

          {/* Contact Fields for main contact only */}
          {type === "contact" &&
            contactFields.map((field) => {
              const Icon = field.icon
              return (
                <Grid item xs={12} sm={6} key={field.value}>
                  <TextInput
                    name={field.value}
                    label={field.label}
                    value={
                      (state[field.value as keyof Contact] as string) || ""
                    }
                    onChange={handleChange}
                    error={!!errors?.[field.value]}
                    errorMessage={errors?.[field.value]}
                    icon={<Icon className={styles.fieldIcon} />}
                    fullWidth
                    type={field.value === "email" ? "email" : "text"}
                    size="small"
                    margin="dense"
                  />
                </Grid>
              )
            })}

          {/* Date Fields */}
          <Grid item xs={12} sm={6}>
            <DateInput
              name="birthday"
              label="Birthday"
              value={state.birthday || ""}
              onChange={handleDateChange}
              error={!!errors?.birthday}
              errorMessage={errors?.birthday}
              icon={<CakeIcon className={styles.fieldIcon} />}
              fullWidth
              disableFuture
              size="small"
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DateInput
              name="nameday.date"
              label="Nameday"
              value={state.nameday?.date || ""}
              onChange={(date) => {
                const nameday = date
                  ? { nameday_id: "", date: date.toISOString() }
                  : undefined
                setState((prev) => ({ ...prev, nameday }))
              }}
              error={!!errors?.["nameday.date"]}
              errorMessage={errors?.["nameday.date"]}
              icon={<PermContactCalendarIcon className={styles.fieldIcon} />}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions className={styles.actions}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          className={styles.saveButton}
          disabled={!state.firstName}
        >
          {type === "connection" ? "Add Connection" : "Add Contact"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddContact

const styles = {
  dialog: css`
    .MuiDialog-paper {
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }
  `,
  title: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 24px 16px;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
  `,
  closeButton: css`
    color: var(--text-secondary);

    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }
  `,
  content: css`
    padding: 0 24px 24px;
  `,
  fieldIcon: css`
    color: var(--primary-main);
    width: 20px;
    height: 20px;
  `,
  actions: css`
    padding: 16px 24px 24px;
    gap: 12px;
  `,
  saveButton: css`
    padding: 10px 24px;
    font-weight: 600;
  `,
}
