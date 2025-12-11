import React, { useCallback } from "react"
import { Card as MUICard, IconButton } from "@mui/material"
import { css, cx } from "@emotion/css"
import { Contact, Connection } from "../../models/contact"
import { useAuth } from "../../context/AuthContext"
import {
  useUpdateContact,
  useUpdateConnection,
  useDeleteContact,
  useDeleteConnection,
} from "../../hooks/useContacts"
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
import AvatarUpload from "../AvatarUpload"

type Props = {
  contact: Contact
  cardKey?: string
  onUpdate?: () => void
}

// Ensures partial contact has all required Contact fields
const enhancedContact = (contact: Partial<Contact>): Contact => {
  return {
    id: contact.id || "",
    userId: contact.userId || "",
    firstName: contact.firstName || "",
    lastName: contact.lastName,
    connections: contact.connections || [],
    createdAt: contact.createdAt || new Date().toISOString(),
    updatedAt: contact.updatedAt || new Date().toISOString(),
    ...contact,
  } as Contact
}

const Card = (props: Props) => {
  const { contact, cardKey, onUpdate } = props
  const [errors, setErrors] = React.useState<Record<string, any>>()
  const [updatedContact, setUpdatedContact] =
    React.useState<Partial<Contact>>(contact)
  const [openConnections, setOpenConnections] = React.useState<boolean>(false)
  const [openAdd, setOpenAdd] = React.useState<boolean>(false)
  const [openEdit, setOpenEdit] = React.useState<boolean>(false)
  const [openEditConnection, setOpenEditConnection] =
    React.useState<boolean>(false)
  const [editingConnection, setEditingConnection] =
    React.useState<Connection | null>(null)
  const [modalInfo, setModalInfo] = React.useState<ModalInfo>()
  const { user } = useAuth()
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(
    contact.avatarUrl || undefined
  )

  const updateContactMutation = useUpdateContact()
  const updateConnectionMutation = useUpdateConnection()
  const deleteContactMutation = useDeleteContact()
  const deleteConnectionMutation = useDeleteConnection()

  const handleEditSave = useCallback(
    async (editedContact: Contact) => {
      try {
        const updated = await updateContactMutation.mutateAsync({
          id: contact.id,
          data: editedContact,
        })
        setUpdatedContact(updated)
        if (onUpdate) onUpdate()
      } catch (error: any) {
        setErrors({ general: error.message || "Failed to update contact" })
      }
    },
    [contact.id, onUpdate, updateContactMutation]
  )

  const handleConnectionEditSave = useCallback(
    async (editedConnection: Contact) => {
      try {
        await updateConnectionMutation.mutateAsync({
          contactId: contact.id,
          connectionId: editedConnection.id,
          data: editedConnection,
        })

        // React Query will auto-update the cache
        if (onUpdate) onUpdate()
      } catch (error: any) {
        setErrors({ general: error.message || "Failed to update connection" })
      }
    },
    [contact.id, onUpdate, updateConnectionMutation]
  )

  const deleteContact = useCallback(async () => {
    try {
      await deleteContactMutation.mutateAsync(contact.id)
      setModalInfo(undefined)
      if (onUpdate) onUpdate()
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to delete contact" })
    }
  }, [contact.id, onUpdate, deleteContactMutation])

  const deleteConnection = useCallback(
    async (connectionId?: string) => {
      if (!connectionId) return

      try {
        await deleteConnectionMutation.mutateAsync({
          contactId: contact.id,
          connectionId,
        })

        // React Query will auto-update the cache
        setModalInfo(undefined)
        if (onUpdate) onUpdate()
      } catch (error: any) {
        setErrors({ general: error.message || "Failed to delete connection" })
      }
    },
    [contact.id, onUpdate, deleteConnectionMutation]
  )

  const onOpenConnections = () => setOpenConnections(!openConnections)

  const onOpenAdd = () => setOpenAdd(true)
  const onCloseAdd = () => {
    setOpenAdd(false)
    // Refresh contact after adding connection
    if (onUpdate) onUpdate()
  }

  const onOpenEdit = () => setOpenEdit(true)
  const onCloseEdit = () => setOpenEdit(false)

  const onOpenEditConnection = (connection: Connection) => {
    setEditingConnection(connection)
    setOpenEditConnection(true)
  }
  const onCloseEditConnection = () => {
    setOpenEditConnection(false)
    setEditingConnection(null)
  }

  const onDelete = useCallback(
    () =>
      setModalInfo({
        title: "Delete Contact",
        type: "destructive",
        description: "Are you sure you want to delete this contact",
        confirmLabel: "Delete",
        onSubmit: deleteContact,
      }),
    [deleteContact]
  )

  const onDeleteConnection = useCallback(
    async (id?: string) => {
      setModalInfo({
        title: "Delete Connection",
        type: "destructive",
        description: "Are you sure you want to delete this connection",
        confirmLabel: "Delete",
        onSubmit: () => deleteConnection(id),
      })
    },
    [deleteConnection]
  )

  const isModalOpen = Boolean(modalInfo)

  const handleAvatarChange = useCallback(
    async (url: string) => {
      setAvatarUrl(url)
      setUpdatedContact((prev) => ({ ...prev, avatarUrl: url }))

      // Auto-save avatar change
      try {
        await updateContactMutation.mutateAsync({
          id: contact.id,
          data: { avatarUrl: url },
        })
        if (onUpdate) onUpdate()
      } catch (error: any) {
        setErrors({ general: error.message || "Failed to update avatar" })
      }
    },
    [contact.id, onUpdate, updateContactMutation]
  )

  React.useEffect(() => {
    setUpdatedContact(contact)
    setAvatarUrl(contact.avatarUrl || undefined)
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
            [styles.active]: openConnections,
          })}
          elevation={0}
        >
          <div className={styles.content}>
            <div className={styles.firstRowContainer}>
              <div className={styles.avatarContainer}>
                <AvatarUpload
                  contactId={contact.id}
                  userId={user?.id || ""}
                  currentAvatarUrl={avatarUrl}
                  onAvatarChange={handleAvatarChange}
                  firstName={contact.firstName}
                  lastName={contact.lastName || undefined}
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
              <CardInfo
                contact={enhancedContact(updatedContact)}
                editable={false}
              />
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
            />
          </div>
        </MUICard>
        <AddContact
          open={openAdd}
          onClose={onCloseAdd}
          type="connection"
          contact={contact}
          onSuccess={onCloseAdd}
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
            contact={enhancedContact(editingConnection as Partial<Contact>)}
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
    padding-bottom: 20px;
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
