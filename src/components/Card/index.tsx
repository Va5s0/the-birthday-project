import React, { useMemo, useCallback } from "react"
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/fbConfig"
import { Card as MUICard, IconButton } from "@mui/material"
import { css, cx } from "@emotion/css"
import { Contact, Common } from "../../models/contact"
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import { CardInfo } from "./CardInfo"
import MoreActions from "../../components/MoreActions"
import ConfirmationModal, {
  ModalInfo,
} from "../../components/ConfirmationModal"
import { EditModal } from "../../components/EditModal"
import AddContact from "../../components/AddContact"
import Connections from "../../components/Connections"
import { getAuth } from "firebase/auth"
import AvatarUpload from "../AvatarUpload"

type Props = {
  contact: Contact
  cardKey?: string
}

// Ensures partial contact has all required Contact fields
const enhancedContact = (contact: Partial<Contact>): Contact => {
  return {
    id: contact.id || "",
    firstName: contact.firstName || "",
    lastName: contact.lastName,
    connections: contact.connections || [],
    ...contact
  } as Contact
}

const Card = (props: Props) => {
  const { contact, cardKey } = props
  const [errors, setErrors] = React.useState<Record<string, any>>()
  const [updatedContact, setUpdatedContact] =
    React.useState<Partial<Contact>>(contact)
  const [openConnections, setOpenConnections] = React.useState<boolean>(false)
  const [openAdd, setOpenAdd] = React.useState<boolean>(false)
  const [openEdit, setOpenEdit] = React.useState<boolean>(false)
  const [openEditConnection, setOpenEditConnection] =
    React.useState<boolean>(false)
  const [editingConnection, setEditingConnection] =
    React.useState<Common | null>(null)
  const [modalInfo, setModalInfo] = React.useState<ModalInfo>()
  const auth = useMemo(() => getAuth(), [])
  const { currentUser } = auth
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(
    contact.avatarUrl
  )

  const onContactChange = (contact?: Partial<Contact>) => {
    const updatedContact = contact || { id: "", firstName: "" }
    setUpdatedContact(updatedContact)
  }

  const handleEditSave = useCallback(async (editedContact: Contact) => {
    try {
      const contactRef = doc(
        db,
        `users/${currentUser?.uid}/contacts/${contact.id}`
      )
      // Convert Contact to Firestore document format
      const { id, ...contactData } = editedContact
      await updateDoc(contactRef, contactData)
      setUpdatedContact(editedContact)
    } catch (error) {
      setErrors(error as Record<string, any>)
    }
  }, [currentUser?.uid, contact.id])

  const handleConnectionEditSave = useCallback(async (editedConnection: Contact) => {
    try {
      const updatedConnections =
        contact.connections?.map((conn) =>
          conn.id === editedConnection.id ? {
            ...editedConnection,
            // Ensure only Common fields are included
            photoURL: undefined,
            phoneNumber: undefined
          } as Common : conn
        ) || []

      const updatedContact = {
        ...contact,
        connections: updatedConnections,
      }

      const contactRef = doc(
        db,
        `users/${currentUser?.uid}/contacts/${contact.id}`
      )
      // Remove id field for Firestore update
      const { id, ...contactData } = updatedContact
      await updateDoc(contactRef, contactData)
      setUpdatedContact(updatedContact)
    } catch (error) {
      setErrors(error as Record<string, any>)
    }
  }, [contact, currentUser?.uid])

  const deleteFromFirestore = useCallback(async (path: string, updatedData?: Partial<Contact>) => {
    try {
      const docRef = doc(db, path)
      if (updatedData) {
        // Remove id field for Firestore update
        const { id, ...dataToUpdate } = updatedData
        await updateDoc(docRef, dataToUpdate)
      } else {
        await deleteDoc(docRef)
      }
      setModalInfo(undefined)
    } catch (error) {
      setErrors(error as Record<string, any>)
    }
  }, [])

  const deleteFbDoc = useCallback(async () => {
    const path = `users/${currentUser?.uid}/contacts/${contact?.id}`
    await deleteFromFirestore(path)
  }, [currentUser?.uid, contact?.id, deleteFromFirestore])

  const deleteConnection = useCallback(async (id?: string) => {
    const updatedContact = {
      ...contact,
      connections: contact?.connections?.filter((c) => c?.id !== id),
    }
    const path = `users/${currentUser?.uid}/contacts/${contact?.id}`
    await deleteFromFirestore(path, updatedContact)
  }, [contact, currentUser?.uid, deleteFromFirestore])

  const onOpenConnections = () => setOpenConnections(!openConnections)

  const onOpenAdd = () => setOpenAdd(true)
  const onCloseAdd = () => setOpenAdd(false)

  const onOpenEdit = () => setOpenEdit(true)
  const onCloseEdit = () => setOpenEdit(false)

  const onOpenEditConnection = (connection: Common) => {
    setEditingConnection(connection)
    setOpenEditConnection(true)
  }
  const onCloseEditConnection = () => {
    setOpenEditConnection(false)
    setEditingConnection(null)
  }

  const onDelete = useCallback(() =>
    setModalInfo({
      title: "Delete Contact",
      type: "destructive",
      description: "Are you sure you want to delete this contact",
      confirmLabel: "Delete",
      onSubmit: deleteFbDoc,
    }), [deleteFbDoc])

  const onDeleteConnection = useCallback(async (id?: string) => {
    setModalInfo({
      title: "Delete Connection",
      type: "destructive",
      description: "Are you sure you want to delete this connection",
      confirmLabel: "Delete",
      onSubmit: () => deleteConnection(id),
    })
  }, [deleteConnection])

  const isModalOpen = Boolean(modalInfo)

  const handleAvatarChange = useCallback(async (url: string) => {
    setAvatarUrl(url)
    setUpdatedContact(prev => ({ ...prev, avatarUrl: url }))

    // Auto-save avatar change
    try {
      const contactRef = doc(
        db,
        `users/${currentUser?.uid}/contacts/${contact.id}`
      )
      await updateDoc(contactRef, { avatarUrl: url })
    } catch (error) {
      setErrors(error as Record<string, any>)
    }
  }, [currentUser?.uid, contact.id])

  React.useEffect(() => {
    setUpdatedContact(contact)
    setAvatarUrl(contact.avatarUrl)
  }, [contact])

  return (
    <div
      className={styles.wrapper}
      data-card-key={cardKey}
      style={
        { "--card-index": cardKey ? Number(cardKey) : 0 } as React.CSSProperties
      }
    >
      <div className={styles.connectionsContainer}>
        <MUICard
          variant="outlined"
          className={cx(styles.cardContainer, {
            [styles.paddingBottom]: !contact?.connections?.length,
            [styles.active]: openConnections,
          })}
          elevation={0}
        >
          <div className={styles.content}>
            <div className={styles.firstRowContainer}>
              <div
                className={styles.avatarContainer}
              >
                <AvatarUpload
                  contactId={contact.id}
                  userId={currentUser?.uid || ""}
                  currentAvatarUrl={avatarUrl}
                  onAvatarChange={handleAvatarChange}
                  firstName={contact.firstName}
                  lastName={contact.lastName}
                />
                <div className={styles.ghostContainer}>
                  <div className={styles.name}>
                    {contact.firstName} {contact.lastName}
                  </div>
                </div>
              </div>
              <MoreActions
                options={[
                  // EDIT
                  {
                    label: "edit",
                    icon: (
                      <EditIcon
                        className={cx(styles.primaryIcon, styles.smallIcon)}
                      />
                    ),
                    onClick: onOpenEdit,
                  },
                  // DELETE
                  {
                    label: "delete",
                    icon: <DeleteIcon className={styles.deleteIcon} />,
                    onClick: onDelete,
                  },
                ]}
              />
            </div>
            <div className={styles.cardInfoContainer}>
              <CardInfo contact={enhancedContact(updatedContact)} editable={false} />
            </div>
            <div className={styles.connectionsRow}>
              {!!contact?.connections?.length && (
                <IconButton onClick={onOpenConnections}>
                  <EmojiPeopleIcon
                    className={cx(styles.primaryIcon, styles.smallIcon)}
                  />
                </IconButton>
              )}
              <IconButton
                onClick={onOpenAdd}
                className={styles.addConnectionButton}
              >
                <AddIcon className={cx(styles.primaryIcon, styles.smallIcon)} />
              </IconButton>
            </div>
            <Connections
              contact={enhancedContact(updatedContact)}
              open={openConnections}
              editable={false}
              onDelete={onDeleteConnection}
              onEditConnection={onOpenEditConnection}
              errors={errors}
              onContactChange={onContactChange}
            />
          </div>
        </MUICard>
        <AddContact
          open={openAdd}
          onClose={onCloseAdd}
          type="connection"
          contact={contact}
        />
        <EditModal
          open={openEdit}
          onClose={onCloseEdit}
          contact={contact}
          onSave={handleEditSave}
        />
        {editingConnection && (
          <EditModal
            open={openEditConnection}
            onClose={onCloseEditConnection}
            contact={enhancedContact(editingConnection)}
            onSave={handleConnectionEditSave}
            isConnection={true}
          />
        )}
      </div>
      <ConfirmationModal
        open={isModalOpen}
        onCancel={() => setModalInfo(undefined)}
        {...modalInfo}
      />
    </div>
  )
}

export default Card

const styles = {
  wrapper: css`
    z-index: calc(1000 - var(--card-index, 0));
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
      transform: translateY(-2px);
    }
  `,
  connectionsContainer: css`
    position: relative;
  `,
  cardContainer: css`
    padding: 24px;
    border-radius: 16px;
    border: 1px solid var(--border-primary);
    position: relative;
    background: var(--bg-surface);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    color: var(--text-primary);
    overflow: hidden;
    backdrop-filter: blur(10px);
    min-height: 120px;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        var(--primary-main) 20%,
        var(--secondary-main) 80%,
        transparent 100%
      );
      opacity: 0.6;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(99, 102, 241, 0.02) 0%,
        transparent 30%,
        transparent 70%,
        rgba(236, 72, 153, 0.02) 100%
      );
      opacity: 0;
      transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }

    &:hover {
      box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15),
        0 2px 4px 0 rgba(0, 0, 0, 0.1);
      border-color: var(--border-secondary);
      transform: translateY(-2px);

      &::before {
        height: 2px;
        opacity: 1;
      }

      &::after {
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      padding: 20px;
      border-radius: 12px;
      min-height: 100px;
    }

    @media (max-width: 480px) {
      padding: 18px;
      border-radius: 12px;
      min-height: 90px;
    }
  `,
  active: css`
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15), 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    border-color: var(--primary-main);
    &:hover {
      box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15),
        0 2px 4px 0 rgba(0, 0, 0, 0.1);
      border-color: var(--primary-main);
    }
  `,
  content: css`
    display: flex;
    flex-direction: column;
  `,
  firstRowContainer: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 48px;
    z-index: 10;
  `,
  avatarContainer: css`
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  `,
  ghostContainer: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  `,
  name: css`
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1.3;
    margin: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;

    &:hover {
      color: var(--primary-main);
      transform: translateX(2px);
    }

    @media (max-width: 768px) {
      font-size: 1rem;
    }

    @media (max-width: 480px) {
      font-size: 0.95rem;
    }
  `,
  connectionsRow: css`
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
    padding-top: 12px;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        var(--border-primary) 20%,
        var(--border-primary) 80%,
        transparent 100%
      );
    }
  `,
  primaryIcon: css`
    color: var(--primary-main);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
      color: var(--primary-dark);
      transform: scale(1.1) rotate(5deg);
      filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3));
    }
  `,
  smallIcon: css`
    width: 18px;
    height: 18px;
  `,
  deleteIcon: css`
    color: #ef4444;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
      color: #dc2626;
      transform: scale(1.1) rotate(-5deg);
      filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3));
    }
  `,
  paddingBottom: css`
    padding-bottom: 20px;
  `,
  cardInfoContainer: css`
    padding: 16px 0 0;
    margin-top: 16px;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        var(--border-primary) 20%,
        var(--border-primary) 80%,
        transparent 100%
      );
    }

    @media (max-width: 768px) {
      padding: 14px 0 0;
      margin-top: 14px;
    }

    @media (max-width: 480px) {
      padding: 12px 0 0;
      margin-top: 12px;
    }
  `,
  addConnectionButton: css`
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    color: var(--primary-main);
    margin-left: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(99, 102, 241, 0.15);
      border-color: rgba(99, 102, 241, 0.3);
      transform: scale(1.05);
    }
  `,
}
