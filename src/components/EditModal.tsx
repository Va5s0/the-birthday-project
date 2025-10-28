import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  IconButton,
} from "@mui/material"
import { css } from "@emotion/css"
import { Contact } from "../models/contact"
import { TextInput } from "./inputs/TextInput"
import { DateInput } from "./inputs/DateInput"
import { contactFields } from "../utils/contactFields"
import { set } from "lodash/fp"
import CloseIcon from "@mui/icons-material/Close"
import CakeIcon from "@mui/icons-material/Cake"
import PersonIcon from "@mui/icons-material/Person"
import Nameday from "./Nameday"

type Props = {
  open: boolean
  onClose: () => void
  contact: Contact
  onSave: (contact: Contact) => void
  title?: string
  isConnection?: boolean
}

export const EditModal = (props: Props) => {
  const { open, onClose, contact, onSave, title, isConnection = false } = props
  const modalTitle =
    title || (isConnection ? "Edit Connection" : "Edit Contact")
  const [editedContact, setEditedContact] = useState<Contact>(contact)
  const [errors, setErrors] = useState<Record<string, string>>({})

  React.useEffect(() => {
    if (open) {
      setEditedContact(contact)
      setErrors({})
    }
  }, [open, contact])

  const handleChange = (
    evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = evt.target
    setEditedContact((prev) => set(name, value, prev))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleDateChange = (date: Date | null, name: string) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setEditedContact((prev) => set(name, date.toISOString(), prev))
    } else {
      setEditedContact((prev) => set(name, null, prev))
    }

    // Clear error when user changes date
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSave = () => {
    // Basic validation
    const newErrors: Record<string, string> = {}

    if (!editedContact.firstName?.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (editedContact.email && !editedContact.email.includes("@")) {
      newErrors.email = "Please enter a valid email"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(editedContact)
    onClose()
  }

  const handleCancel = () => {
    setEditedContact(contact)
    setErrors({})
    onClose()
  }

  const handleNamedayChange = (updatedContact?: Partial<Contact>) => {
    if (updatedContact) {
      setEditedContact((prev) => ({ ...prev, ...updatedContact }))
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      className={styles.dialog}
    >
      <DialogTitle className={styles.title}>
        {modalTitle}
        <IconButton
          onClick={handleCancel}
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
              value={editedContact.firstName || ""}
              onChange={handleChange}
              error={!!errors.firstName}
              errorMessage={errors.firstName}
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
              value={editedContact.lastName || ""}
              onChange={handleChange}
              error={!!errors.lastName}
              errorMessage={errors.lastName}
              icon={<PersonIcon className={styles.fieldIcon} />}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>

          {/* Contact Fields */}
          {!isConnection &&
            contactFields.map((field) => {
              const Icon = field.icon
              return (
                <Grid item xs={12} sm={6} key={field.value}>
                  <TextInput
                    name={field.value}
                    label={field.label}
                    value={
                      (editedContact[field.value as keyof Contact] as string) ||
                      ""
                    }
                    onChange={handleChange}
                    error={!!errors[field.value]}
                    errorMessage={errors[field.value]}
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
              value={editedContact.birthday || ""}
              onChange={handleDateChange}
              error={!!errors.birthday}
              errorMessage={errors.birthday}
              icon={<CakeIcon className={styles.fieldIcon} />}
              fullWidth
              disableFuture
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Nameday
              contact={editedContact}
              hasError={() => !!errors["nameday.date"]}
              errorMsg={() => errors["nameday.date"] || ""}
              onContactChange={handleNamedayChange}
              margin="dense"
              size="small"
              className={styles.fullWidth}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions className={styles.actions}>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          className={styles.saveButton}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const styles = {
  dialog: css`
    .MuiDialog-paper {
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    .MuiDialogTitle-root + .MuiDialogContent-root {
      padding-top: 4px;
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
  fullWidth: css`
    width: 100%;
  `,
}
