import React from "react"
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import { db } from "firebase/fbConfig"
import { Card as MUICard, IconButton } from "@material-ui/core"
import { css, cx } from "emotion"
import { Contact } from "models/contact"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import CloseIcon from "@material-ui/icons/Close"
import CheckIcon from "@material-ui/icons/Check"
import AddIcon from "@material-ui/icons/Add"
import { CardInfo } from "./CardInfo"
import MoreActions from "components/MoreActions"
import ConfirmationModal, { ModalInfo } from "components/ConfirmationModal"
import GhostTextInput from "components/inputs/GhostTextInput"
import AddContact from "components/AddContact"
import Connections from "components/Connections"
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
  `,
  cardContainer: css`
    padding: 16px;
    border-radius: 0;
    border: none;
    position: relative;
    border-top: 2px solid var(--secondary-main);
  `,
  content: css`
    display: flex;
    flex-direction: column;
    grid-row-gap: 20px;
  `,
  firstRowContainer: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    z-index: 10;
  `,
  avatarContainer: css`
    display: flex;
    align-items: center;
  `,
  avatarContainerGap: css`
    grid-column-gap: 16px;
  `,
  avatar: css`
    width: 48px;
    height: 48px;
    color: var(--dark-grey);
    background-color: white;
    border-radius: 50%;
  `,
  ghostContainer: css`
    display: flex;
    flex-direction: column;
    max-width: 148px;
  `,
  name: css`
    font-size: 16px;
  `,
  more: css`
    width: 20px;
    height: 20px;
  `,
  connectionsRow: css`
    display: flex;
    justify-content: flex-end;
  `,
  elevated: css`
    z-index: 500;
    position: relative;
  `,
  primaryIcon: css`
    color: var(--primary-main);
  `,
  smallIcon: css`
    width: 16px;
    height: 16px;
  `,
  deleteIcon: css`
    color: var(--red);
  `,
  cancelIcon: css`
    width: 36px;
    height: 36px;
  `,
  disabledIcon: css`
    color: rgba(0, 0, 0, 0.26);
  `,
  paddingBottom: css`
    padding-bottom: 32px;
  `,
}
