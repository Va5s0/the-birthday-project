import React, { ChangeEvent } from "react"
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import { db } from "firebase/config"
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
import { set } from "lodash/fp"
import AddContact from "components/AddContact"
import Connections from "components/Connections"

type Props = {
  contact: Contact
}

const nameFields = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
]

const Card = (props: Props) => {
  const { contact } = props
  const [state, setState] = React.useState<Contact>(contact)
  const [errors, setErrors] = React.useState<Record<string, any>>()
  const [open, setOpen] = React.useState<boolean>(false)
  const [openAdd, setOpenAdd] = React.useState<boolean>(false)
  const [modalInfo, setModalInfo] = React.useState<ModalInfo>()
  const [editable, setEditable] = React.useState<boolean>(false)

  const editFbDoc = async () => {
    const contactRef = doc(db, `contacts/${contact?.id}`)
    await updateDoc(contactRef, { ...state }).catch((e) => setErrors(e))
    setEditable(false)
    setOpen(false)
  }

  const deleteFbDoc = async () => {
    const contactRef = doc(db, `contacts/${contact?.id}`)
    await deleteDoc(contactRef)
    setModalInfo(undefined)
  }

  const deleteConnection = async (id?: string) => {
    const updatedContact = {
      ...contact,
      connections: contact?.connections?.filter((c) => c?.id !== id),
    }
    const contactRef = doc(db, `contacts/${contact?.id}`)
    await updateDoc(contactRef, updatedContact)
    setModalInfo(undefined)
  }

  const handleChange = (
    evt: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = evt.target
    const updated = set(name, value, contact)
    setState(updated)
  }

  const handleDateChange = (date: Date | null, name: string) => {
    const updated = set(name, date?.toISOString(), contact)
    setState(updated)
  }

  const onOpen = () => setOpen(!open)

  const onOpenAdd = () => setOpenAdd(true)
  const onCloseAdd = () => setOpenAdd(false)

  const onEdit = () => {
    setEditable(true)
    setOpen(true)
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

  React.useEffect(() => setState(() => contact), [contact])

  return (
    <div className={cx(styles.wrapper, { [styles.elevated]: open })}>
      <MUICard
        variant={open ? "elevation" : "outlined"}
        className={styles.cardContainer}
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
                        (state[nf?.value as keyof Contact] as string) || ""
                      }
                      onChange={handleChange}
                      error={!!errors && !!errors[nf?.value]}
                      errorMessage={!!errors ? errors[nf?.value] : ""}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className={styles.name}
                >{`${state?.firstName} ${state.lastName}`}</div>
              )}
            </div>
            {editable ? (
              <div>
                <IconButton aria-label="close" onClick={onCancelEdit}>
                  <CloseIcon className={styles.cancelIcon} />
                </IconButton>
                <IconButton onClick={editFbDoc}>
                  <CheckIcon
                    className={cx(styles.cancelIcon, styles.primaryIcon)}
                  />
                </IconButton>
              </div>
            ) : (
              <MoreActions
                options={[
                  // ADD
                  {
                    label: "add",
                    icon: <AddIcon className={styles.primaryIcon} />,
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
            contact={state}
            editable={editable}
            errors={errors}
            handleChange={handleChange}
            handleDateChange={handleDateChange}
          />
          {!!state?.connections?.length ? (
            <div className={styles.connectionsRow}>
              <IconButton onClick={onOpen}>
                <EmojiPeopleIcon className={styles.primaryIcon} />
              </IconButton>
            </div>
          ) : null}
        </div>
      </MUICard>
      <Connections
        connections={state?.connections}
        open={open}
        editable={editable}
        handleChange={handleChange}
        handleDateChange={handleDateChange}
        onDelete={onDeleteConnection}
        errors={errors}
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
    position: relative;
  `,
  cardContainer: css`
    width: 350px;
    min-height: 200px;
    padding: 16px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
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
  `,
  primaryIcon: css`
    color: var(--primary-main);
  `,
  deleteIcon: css`
    color: var(--red);
  `,
  cancelIcon: css`
    width: 36px;
    height: 36px;
  `,
}
