import { useState, useCallback } from "react"
import { Contact, Connection } from "../models/contact"
import { css } from "@emotion/css"
import { contactFields } from "../utils/contactFields"
import CakeIcon from "@mui/icons-material/Cake"
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar"
import MoreActions from "./MoreActions"
import AddContact from "./AddContact"
import ConfirmationModal from "./ConfirmationModal"
import { EditModal } from "./EditModal"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import {
  useUpdateContact,
  useDeleteContact,
  useDeleteConnection,
  useUpdateConnection,
} from "../hooks/useContacts"

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

const TreeCard = ({ contacts }: { contacts: Contact[] }) => {
  // Track which contacts/connections are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [addOpen, setAddOpen] = useState<{ open: boolean; contact?: Contact }>({
    open: false,
  })
  const [deleteInfo, setDeleteInfo] = useState<{
    open: boolean
    contact?: Contact
    connectionIdx?: number
  }>({ open: false })

  // Modal state for editing
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openEditConnection, setOpenEditConnection] = useState<boolean>(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [editingConnection, setEditingConnection] = useState<{
    connection: Connection
    parentContact: Contact
  } | null>(null)

  const updateContactMutation = useUpdateContact()
  const deleteContactMutation = useDeleteContact()
  const deleteConnectionMutation = useDeleteConnection()
  const updateConnectionMutation = useUpdateConnection()

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Helper to render all info for a contact/connection
  const renderInfo = (item: Contact | Connection) => (
    <div className={styles.infoBox}>
      {contactFields.map((field) => {
        const value = item[field.value as keyof (Contact | Connection)]
        if (!value || typeof value === "object") return null
        return (
          <div className={styles.infoRow} key={field.value}>
            {field.icon && <field.icon className={styles.infoIcon} />}
            <span>{value}</span>
          </div>
        )
      })}
      {item.birthday && (
        <div className={styles.infoRow}>
          <CakeIcon className={styles.infoIcon} />
          <span>{item.birthday}</span>
        </div>
      )}
      {item.namedayDate && (
        <div className={styles.infoRow}>
          <PermContactCalendarIcon className={styles.infoIcon} />
          <span>{item.namedayDate}</span>
        </div>
      )}
      {item.email && (
        <div className={styles.infoRow}>
          <span>Email: {item.email}</span>
        </div>
      )}
    </div>
  )

  // Add/Edit/Delete handlers
  const handleAdd = (contact?: Contact) => setAddOpen({ open: true, contact })
  const handleDelete = (contact: Contact, connectionIdx?: number) =>
    setDeleteInfo({ open: true, contact, connectionIdx })
  const closeAdd = () => setAddOpen({ open: false })
  const closeDelete = () => setDeleteInfo({ open: false })

  const handleDeleteConfirm = async () => {
    if (!deleteInfo.contact) return

    try {
      if (deleteInfo.connectionIdx === undefined) {
        // Delete contact
        await deleteContactMutation.mutateAsync(deleteInfo.contact.id)
      } else {
        // Delete connection
        const connection =
          deleteInfo.contact.connections?.[deleteInfo.connectionIdx]
        if (!connection) return

        await deleteConnectionMutation.mutateAsync({
          contactId: deleteInfo.contact.id,
          connectionId: connection.id,
        })
      }
      closeDelete()
    } catch (error) {
      console.error("Error deleting:", error)
    }
  }

  // Open edit modal for contact or connection
  const handleEdit = (contact: Contact, connectionIdx?: number) => {
    if (connectionIdx === undefined) {
      setEditingContact(contact)
      setOpenEdit(true)
    } else {
      const connection = contact.connections?.[connectionIdx]
      if (connection) {
        setEditingConnection({ connection, parentContact: contact })
        setOpenEditConnection(true)
      }
    }
  }

  // Close edit modals
  const onCloseEdit = () => {
    setOpenEdit(false)
    setEditingContact(null)
  }

  const onCloseEditConnection = () => {
    setOpenEditConnection(false)
    setEditingConnection(null)
  }

  // Save contact edit
  const handleContactEditSave = useCallback(
    async (editedContact: Contact) => {
      try {
        await updateContactMutation.mutateAsync({
          id: editedContact.id,
          data: editedContact,
        })
        // React Query will auto-update the cache
      } catch (error) {
        console.error("Error updating contact:", error)
      }
    },
    [updateContactMutation]
  )

  // Save connection edit
  const handleConnectionEditSave = useCallback(
    async (editedConnection: Contact) => {
      if (!editingConnection) return

      try {
        await updateConnectionMutation.mutateAsync({
          contactId: editingConnection.parentContact.id,
          connectionId: editedConnection.id,
          data: editedConnection,
        })
        // React Query will auto-update the cache
      } catch (error) {
        console.error("Error updating connection:", error)
      }
    },
    [editingConnection, updateConnectionMutation]
  )

  // Render MoreActions for contacts and connections
  const renderActions = (contact: Contact, connectionIdx?: number) => {
    const options = [
      connectionIdx === undefined
        ? {
            label: "add",
            icon: <AddIcon fontSize="small" />,
            onClick: () => handleAdd(contact),
          }
        : null,
      {
        label: "edit",
        icon: <EditIcon fontSize="small" />,
        onClick: () => handleEdit(contact, connectionIdx),
      },
      {
        label: "delete",
        icon: <DeleteIcon fontSize="small" />,
        onClick: () => handleDelete(contact, connectionIdx),
      },
    ].filter(Boolean) as any // filter out nulls
    return <MoreActions options={options} />
  }
  console.log({ ddd: contacts?.length })

  return !!contacts.length ? (
    <div className={styles.treeList}>
      <ul className={styles.treeUl}>
        {contacts.map((contact) => (
          <li key={contact.id} className={styles.treeItem}>
            <div className={styles.headerRow}>
              <span
                className={styles.contactName}
                onClick={() => toggleExpand(contact.id)}
                style={{ cursor: "pointer" }}
              >
                <span className={styles.avatarCircle}>
                  {`${(contact.firstName?.[0] || "").toUpperCase()}${(
                    contact.lastName?.[0] || ""
                  ).toUpperCase()}`.trim() || "?"}
                </span>
                {contact.firstName} {contact.lastName}
                <span className={styles.toggleBtn}>
                  {expanded[contact.id] ? "▲" : "▼"}
                </span>
              </span>
              {renderActions(contact)}
            </div>
            {expanded[contact.id] && renderInfo(contact)}
            {contact.connections && contact.connections.length > 0 && (
              <ul className={styles.treeUl}>
                {contact.connections.map((conn, idx) => (
                  <li key={conn.id || idx} className={styles.treeItem}>
                    <div className={styles.headerRow}>
                      <span
                        className={styles.connectionName}
                        onClick={() =>
                          toggleExpand(`${contact.id}-conn-${idx}`)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <span className={styles.avatarCircleSmall}>
                          {`${(conn.firstName?.[0] || "").toUpperCase()}${(
                            conn.lastName?.[0] || ""
                          ).toUpperCase()}`.trim() || "?"}
                        </span>
                        {conn.firstName} {conn.lastName}
                        <span className={styles.toggleBtn}>
                          {expanded[`${contact.id}-conn-${idx}`] ? "▲" : "▼"}
                        </span>
                      </span>
                      {renderActions(contact, idx)}
                    </div>
                    {expanded[`${contact.id}-conn-${idx}`] && renderInfo(conn)}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {/* AddContact modal for adding new contact/connection */}
      <AddContact
        open={addOpen.open}
        onClose={closeAdd}
        type={addOpen.contact ? "connection" : "contact"}
        contact={addOpen.contact}
      />

      {/* EditModal for editing contacts */}
      {editingContact && (
        <EditModal
          open={openEdit}
          onClose={onCloseEdit}
          contact={editingContact}
          onSave={handleContactEditSave}
        />
      )}

      {/* EditModal for editing connections */}
      {editingConnection && (
        <EditModal
          open={openEditConnection}
          onClose={onCloseEditConnection}
          contact={enhancedContact(
            editingConnection.connection as Partial<Contact>
          )}
          onSave={handleConnectionEditSave}
          isConnection={true}
        />
      )}

      {/* ConfirmationModal for delete */}
      <ConfirmationModal
        open={deleteInfo.open}
        onCancel={closeDelete}
        title={
          deleteInfo.connectionIdx === undefined
            ? "Delete Contact"
            : "Delete Connection"
        }
        description={
          deleteInfo.connectionIdx === undefined
            ? "Are you sure you want to delete this contact?"
            : "Are you sure you want to delete this connection?"
        }
        confirmLabel="Delete"
        type="destructive"
        onSubmit={handleDeleteConfirm}
      />
    </div>
  ) : null
}

const styles = {
  treeList: css`
    padding: 32px;
    max-width: 1200px;
    margin: 24px auto;
    background: var(--bg-surface);
    border-radius: 24px;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border-primary);
    color: var(--text-primary);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;

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
      opacity: 0.7;
      transition: all 0.3s ease;
    }

    &:hover {
      &::before {
        height: 3px;
        opacity: 1;
      }
    }

    @media (max-width: 1440px) {
      padding: 24px;
      margin: 24px;
    }

    @media (max-width: 768px) {
      padding: 16px;
      margin: 16px;
      border-radius: 16px;
    }

    @media (max-width: 480px) {
      padding: 12px;
      margin: 12px;
      border-radius: 12px;
    }
  `,
  treeUl: css`
    list-style: none;
    padding-left: 24px;
    margin: 0;

    @media (max-width: 768px) {
      padding-left: 16px;
    }

    @media (max-width: 480px) {
      padding-left: 12px;
    }
  `,
  treeItem: css`
    margin-bottom: 16px;
    position: relative;
    border-left: 2px solid var(--border-primary);
    padding-left: 16px;
    transition: all 0.3s ease;
    &::before {
      content: "";
      position: absolute;
      left: -8px;
      top: 16px;
      width: 16px;
      height: 1px;
      background: var(--border-secondary);
    }
    &:hover {
      border-left-color: var(--primary-main);
    }

    @media (max-width: 768px) {
      padding-left: 12px;
      margin-bottom: 12px;
    }

    @media (max-width: 480px) {
      padding-left: 8px;
      margin-bottom: 10px;
      &::before {
        width: 12px;
        left: -6px;
      }
    }
  `,
  headerRow: css`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    padding: 8px 12px;
    border-radius: 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    transition: all 0.3s ease;
    &:hover {
      background: var(--bg-tertiary);
      border-color: var(--border-secondary);
      transform: translateX(4px);
    }

    @media (max-width: 768px) {
      padding: 6px 10px;
      gap: 10px;
    }

    @media (max-width: 480px) {
      padding: 6px 8px;
      gap: 8px;
      border-radius: 8px;
    }
  `,
  avatarCircle: css`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      var(--primary-main),
      var(--primary-light)
    );
    color: var(--text-inverse);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1rem;
    box-shadow: var(--shadow-md);
    transition: all 0.3s ease;
    margin-right: 8px;
    &:hover {
      transform: scale(1.05);
      box-shadow: var(--shadow-lg);
    }
  `,
  avatarCircleSmall: css`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      var(--secondary-main),
      var(--secondary-light)
    );
    color: var(--text-inverse);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 0.875rem;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    margin-right: 8px;
    &:hover {
      transform: scale(1.05);
      box-shadow: var(--shadow-md);
    }
  `,
  contactName: css`
    font-weight: 600;
    color: var(--text-primary);
    user-select: none;
    font-size: 1.125rem;
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
      color: var(--primary-main);
    }
  `,
  connectionName: css`
    font-weight: 500;
    color: var(--text-secondary);
    user-select: none;
    font-size: 1rem;
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
      color: var(--secondary-main);
    }
  `,
  toggleBtn: css`
    font-size: 0.875rem;
    margin-left: 8px;
    color: var(--text-tertiary);
    transition: all 0.3s ease;
    &:hover {
      color: var(--primary-main);
      transform: scale(1.1);
    }
  `,
  infoBox: css`
    margin: 12px 0 12px 24px;
    padding: 16px 20px;
    background: var(--bg-primary);
    border-radius: 16px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-primary);
    transition: all 0.3s ease;
    gap: 8px;
    &:hover {
      background: var(--bg-tertiary);
      border-color: var(--border-secondary);
    }

    @media (max-width: 768px) {
      margin-left: 16px;
      padding: 12px 16px;
      border-radius: 12px;
    }

    @media (max-width: 480px) {
      margin-left: 8px;
      padding: 10px 12px;
      border-radius: 10px;
    }
  `,
  infoRow: css`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
    color: var(--text-secondary);
    font-size: 0.875rem;
    &:last-child {
      margin-bottom: 0;
    }
  `,
  infoIcon: css`
    font-size: 1.125rem;
    color: var(--primary-main);
    flex-shrink: 0;
  `,
}

export default TreeCard
