import { useState } from "react"
import { Contact, Common } from "../models/contact"
import { css } from "@emotion/css"
import { contactFields } from "../utils/contactFields"
import CakeIcon from "@mui/icons-material/Cake"
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar"
import MoreActions from "./MoreActions"
import AddContact from "./AddContact"
import ConfirmationModal from "./ConfirmationModal"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/fbConfig"
import { useAuth } from "../context/AuthContext"

const TreeCard = ({ contacts }: { contacts: Contact[] }) => {
  const authContext = useAuth()
  const currentUser = authContext?.user

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

  // Remove editOpen and related logic, and implement edit as an inline form for contacts/connections
  // Add state for editing contact/connection inline
  const [editing, setEditing] = useState<{
    contactId?: string
    connIdx?: number
  } | null>(null)
  const [editState, setEditState] = useState<Partial<Contact> | null>(null)

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Helper to render all info for a contact/connection
  const renderInfo = (item: Common) => (
    <div className={styles.infoBox}>
      {contactFields.map((field) => {
        const value = item[field.value as keyof Common]
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
      {item.nameday?.date && (
        <div className={styles.infoRow}>
          <PermContactCalendarIcon className={styles.infoIcon} />
          <span>{item.nameday.date}</span>
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

  // Start editing a contact or connection
  const handleEdit = (contact: Contact, connectionIdx?: number) => {
    if (connectionIdx === undefined) {
      setEditing({ contactId: contact.id })
      setEditState({ ...contact })
    } else {
      setEditing({ contactId: contact.id, connIdx: connectionIdx })
      setEditState({ ...contact.connections?.[connectionIdx] })
    }
  }

  // Save edit (for contact or connection)
  const handleEditSave = async () => {
    if (!editing || !editState) return
    if (editing.connIdx === undefined) {
      // Edit contact
      const contactRef = doc(
        db,
        `users/${currentUser?.uid}/contacts/${editing.contactId}`
      )
      await updateDoc(contactRef, { ...editState })
    } else {
      // Edit connection
      const contact = contacts.find((c) => c.id === editing.contactId)
      if (!contact) return
      const updatedConnections = [...(contact.connections || [])]
      updatedConnections[editing.connIdx] = {
        ...updatedConnections[editing.connIdx],
        ...editState,
      }
      const contactRef = doc(
        db,
        `users/${currentUser?.uid}/contacts/${editing.contactId}`
      )
      await updateDoc(contactRef, {
        ...contact,
        connections: updatedConnections,
      })
    }
    setEditing(null)
    setEditState(null)
  }

  // Cancel edit
  const handleEditCancel = () => {
    setEditing(null)
    setEditState(null)
  }

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

  return (
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
            {expanded[contact.id] &&
              (editing?.contactId === contact.id &&
              editing.connIdx === undefined ? (
                <div className={styles.editForm}>
                  {contactFields.map((field) => (
                    <input
                      key={field.value}
                      value={
                        (editState?.[field.value as keyof Contact] as string) ||
                        ""
                      }
                      onChange={(e) =>
                        setEditState((s) => ({
                          ...s,
                          [field.value]: e.target.value,
                        }))
                      }
                      placeholder={field.label}
                    />
                  ))}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleEditSave}>Save</button>
                    <button onClick={handleEditCancel}>Cancel</button>
                  </div>
                </div>
              ) : (
                renderInfo(contact)
              ))}
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
                    {expanded[`${contact.id}-conn-${idx}`] &&
                      (editing?.contactId === contact.id &&
                      editing.connIdx === idx ? (
                        <div className={styles.editForm}>
                          {contactFields.map((field) => (
                            <input
                              key={field.value}
                              value={
                                (editState?.[
                                  field.value as keyof Contact
                                ] as string) || ""
                              }
                              onChange={(e) =>
                                setEditState((s) => ({
                                  ...s,
                                  [field.value]: e.target.value,
                                }))
                              }
                              placeholder={field.label}
                            />
                          ))}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={handleEditSave}>Save</button>
                            <button onClick={handleEditCancel}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        renderInfo(conn)
                      ))}
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
        onSubmit={closeDelete /* TODO: implement actual delete logic */}
      />
    </div>
  )
}

const styles = {
  treeList: css`
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
    background: var(--bg-surface);
    border-radius: 24px;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border-primary);
    color: var(--text-primary);
    transition: all 0.3s ease;
  `,
  treeUl: css`
    list-style: none;
    padding-left: 24px;
    margin: 0;
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
  `,
  avatarCircle: css`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-main), var(--primary-light));
    color: var(--text-inverse);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1rem;
    box-shadow: var(--shadow-md);
    transition: all 0.3s ease;
    &:hover {
      transform: scale(1.05);
      box-shadow: var(--shadow-lg);
    }
  `,
  avatarCircleSmall: css`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--secondary-main), var(--secondary-light));
    color: var(--text-inverse);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 0.875rem;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
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
    &:hover {
      background: var(--bg-tertiary);
      border-color: var(--border-secondary);
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
  editForm: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 12px 0 12px 24px;
    padding: 16px 20px;
    background: var(--bg-primary);
    border-radius: 16px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-primary);
    
    input {
      padding: 8px 12px;
      border: 1px solid var(--border-primary);
      border-radius: 8px;
      background: var(--bg-surface);
      color: var(--text-primary);
      font-size: 0.875rem;
      transition: all 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: var(--primary-main);
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
      }
    }
    
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:first-of-type {
        background: var(--primary-main);
        color: var(--text-inverse);
        &:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }
      }
      
      &:last-of-type {
        background: var(--bg-tertiary);
        color: var(--text-secondary);
        &:hover {
          background: var(--border-secondary);
          color: var(--text-primary);
        }
      }
    }
  `,
}

export default TreeCard
