import React from "react"
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/fbConfig"
import { Card as MUICard, IconButton } from "@mui/material"
import { css, cx } from "@emotion/css"
import { Contact } from "../../models/contact"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import CloseIcon from "@mui/icons-material/Close"
import CheckIcon from "@mui/icons-material/Check"
import AddIcon from "@mui/icons-material/Add"
import { CardInfo } from "./CardInfo"
import MoreActions from "../../components/MoreActions"
import ConfirmationModal, {
  ModalInfo,
} from "../../components/ConfirmationModal"
import GhostTextInput from "../../components/inputs/GhostTextInput"
import AddContact from "../../components/AddContact"
import Connections from "../../components/Connections"
import { set } from "lodash/fp"
import { getAuth } from "firebase/auth"

type Props = {
  contact: Contact
}

type Name = { firstName?: string; lastName?: string }

const nameFields = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
]

const Card = (props: Props) => {
  const { contact } = props
  const [errors, setErrors] = React.useState<Record<string, any>>()
  const [updatedContact, setUpdatedContact] = React.useState<Contact>(contact)
  const [open, setOpen] = React.useState<boolean>(false)
  const [openAdd, setOpenAdd] = React.useState<boolean>(false)
  const [modalInfo, setModalInfo] = React.useState<ModalInfo>()
  const [editable, setEditable] = React.useState<boolean>(false)
  const auth = getAuth()
  const { currentUser } = auth

  const editFbDoc = async () => {
    const contactRef = doc(
      db,
      `users/${currentUser?.uid}/contacts/${contact?.id}`
    )
    await updateDoc(contactRef, { ...updatedContact }).catch((e) =>
      setErrors(e)
    )
    setEditable(false)
    setOpen(false)
  }

  const onContactChange = (contact?: Contact) => {
    console.log({ contact })
    setUpdatedContact(contact || {})
  }

  const deleteFbDoc = async () => {
    const contactRef = doc(
      db,
      `users/${currentUser?.uid}/contacts/${contact?.id}`
    )
    await deleteDoc(contactRef)
    setModalInfo(undefined)
  }

  const deleteConnection = async (id?: string) => {
    const updatedContact = {
      ...contact,
      connections: contact?.connections?.filter((c) => c?.id !== id),
    }
    const contactRef = doc(
      db,
      `users/${currentUser?.uid}/contacts/${contact?.id}`
    )
    await updateDoc(contactRef, updatedContact)
    setModalInfo(undefined)
  }

  const onOpen = () => setOpen(!open)

  const onOpenAdd = () => setOpenAdd(true)
  const onCloseAdd = () => setOpenAdd(false)

  const onEdit = () => {
    setEditable(true)
    setOpen(true)
  }

  const handleChange = (
    evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = evt.target
    const updated = set(name, value, updatedContact)
    setUpdatedContact(updated)
  }

  const onDelete = async () =>
    setModalInfo({
      title: "Delete Contact",
      type: "destructive",
      description: "Are you sure you want to delete this contact",
      confirmLabel: "Delete",
      onSubmit: deleteFbDoc,
    })

  const onDeleteConnection = async (id?: string) =>
    setModalInfo({
      title: "Delete Connection",
      type: "destructive",
      description: "Are you sure you want to delete this connection",
      confirmLabel: "Delete",
      onSubmit: () => deleteConnection(id),
    })

  const onCancelEdit = () => {
    setEditable(false)
    setOpen(false)
  }

  const isModalOpen = Boolean(modalInfo)

  React.useEffect(() => setUpdatedContact(contact), [contact])

  return (
    <div className={cx(styles.wrapper, { [styles.elevated]: open })}>
      <MUICard
        variant={open ? "elevation" : "outlined"}
        className={cx(styles.cardContainer, {
          [styles.paddingBottom]: !contact?.connections?.length,
        })}
        elevation={6}
      >
        <div className={styles.content}>
          <div className={styles.firstRowContainer}>
            <div
              className={cx(styles.avatarContainer, {
                [styles.avatarContainerGap]: !editable,
              })}
            >
              <AccountCircleIcon className={styles.avatar} />
              {editable ? (
                <div className={styles.ghostContainer}>
                  {nameFields.map((nf, idx) => (
                    <GhostTextInput
                      key={idx}
                      name={nf?.value}
                      placeholder={nf?.label}
                      value={
                        (updatedContact[nf?.value as keyof Name] as string) ||
                        ""
                      }
                      onChange={handleChange}
                      error={!!errors && !!errors[nf?.value]}
                      errorMessage={!!errors ? errors[nf?.value] : ""}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.name}>{`${contact.firstName} ${
                  contact?.lastName || ""
                }`}</div>
              )}
            </div>
            {editable ? (
              <div>
                <IconButton aria-label="close" onClick={onCancelEdit}>
                  <CloseIcon className={styles.cancelIcon} />
                </IconButton>
                <IconButton
                  onClick={editFbDoc}
                  disabled={!updatedContact["firstName"]}
                >
                  <CheckIcon
                    className={cx(styles.cancelIcon, styles.primaryIcon, {
                      [styles.disabledIcon]: !updatedContact["firstName"],
                    })}
                  />
                </IconButton>
              </div>
            ) : (
              <MoreActions
                options={[
                  // ADD
                  {
                    label: "add",
                    icon: (
                      <AddIcon
                        className={cx(styles.primaryIcon, styles.smallIcon)}
                      />
                    ),
                    onClick: onOpenAdd,
                  },
                  // EDIT
                  {
                    label: "edit",
                    icon: <EditIcon />,
                    onClick: onEdit,
                  },
                  // DELETE
                  {
                    label: "delete",
                    icon: <DeleteIcon className={styles.deleteIcon} />,
                    onClick: onDelete,
                  },
                ]}
              />
            )}
          </div>
          <CardInfo
            contact={updatedContact}
            editable={editable}
            errors={errors}
            onContactChange={onContactChange}
          />
          {!!contact?.connections?.length ? (
            <div className={styles.connectionsRow}>
              <IconButton onClick={onOpen}>
                <EmojiPeopleIcon
                  className={cx(styles.primaryIcon, styles.smallIcon)}
                />
              </IconButton>
            </div>
          ) : null}
        </div>
      </MUICard>
      <Connections
        contact={updatedContact}
        open={open}
        editable={editable}
        onDelete={onDeleteConnection}
        errors={errors}
        handleChange={handleChange}
        onContactChange={onContactChange}
      />
      <ConfirmationModal
        open={isModalOpen}
        onCancel={() => setModalInfo(undefined)}
        {...modalInfo}
      />
      <AddContact
        open={openAdd}
        onClose={onCloseAdd}
        type="connection"
        contact={contact}
      />
    </div>
  )
}

export default Card

const styles = {
  wrapper: css`
    z-index: 300;
    padding: 0 15px 30px;
    transition: all 0.3s ease;
  `,
  cardContainer: css`
    padding: 24px;
    border-radius: 16px;
    border: none;
    position: relative;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
  `,
  content: css`
    display: flex;
    flex-direction: column;
    grid-row-gap: 24px;
  `,
  firstRowContainer: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    z-index: 10;
  `,
  avatarContainer: css`
    display: flex;
    align-items: center;
    gap: 16px;
  `,
  avatarContainerGap: css`
    gap: 16px;
  `,
  avatar: css`
    width: 56px;
    height: 56px;
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
  ghostContainer: css`
    display: flex;
    flex-direction: column;
    max-width: 200px;
    gap: 8px;
  `,
  name: css`
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    letter-spacing: -0.025em;
  `,
  more: css`
    width: 24px;
    height: 24px;
  `,
  connectionsRow: css`
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  `,
  elevated: css`
    z-index: 500;
    position: relative;
  `,
  primaryIcon: css`
    color: var(--primary-main);
    transition: all 0.2s ease;
    &:hover {
      color: var(--primary-dark);
      transform: scale(1.1);
    }
  `,
  smallIcon: css`
    width: 20px;
    height: 20px;
  `,
  deleteIcon: css`
    color: #ef4444;
    transition: all 0.2s ease;
    &:hover {
      color: #dc2626;
      transform: scale(1.1);
    }
  `,
  cancelIcon: css`
    width: 40px;
    height: 40px;
    transition: all 0.2s ease;
    &:hover {
      transform: scale(1.1);
    }
  `,
  disabledIcon: css`
    color: rgba(0, 0, 0, 0.26);
    cursor: not-allowed;
  `,
  paddingBottom: css`
    padding-bottom: 32px;
  `,
}
