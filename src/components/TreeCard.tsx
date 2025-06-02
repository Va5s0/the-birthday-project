import React, { useState } from "react"
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
import { db } from "../firebase/fbConfig"
import { doc, updateDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const TreeCard = ({ contacts }: { contacts: Contact[] }) => {
  // Track which contacts/connections are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [addOpen, setAddOpen] = useState<{ open: boolean; contact?: Contact }>({ open: false })
  const [deleteInfo, setDeleteInfo] = useState<{ open: boolean; contact?: Contact; connectionIdx?: number }>({ open: false })

  // Remove editOpen and related logic, and implement edit as an inline form for contacts/connections
  // Add state for editing contact/connection inline
  const [editing, setEditing] = useState<{ contactId?: string; connIdx?: number } | null>(null)
  const [editState, setEditState] = useState<Partial<Contact> | null>(null)

  const auth = getAuth();
  const { currentUser } = auth;

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
  const handleDelete = (contact: Contact, connectionIdx?: number) => setDeleteInfo({ open: true, contact, connectionIdx })
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
      updatedConnections[editing.connIdx] = { ...updatedConnections[editing.connIdx], ...editState }
      const contactRef = doc(
        db,
        `users/${currentUser?.uid}/contacts/${editing.contactId}`
      )
      await updateDoc(contactRef, { ...contact, connections: updatedConnections })
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
            {expanded[contact.id] && (
              editing?.contactId === contact.id && editing.connIdx === undefined ? (
                <div className={styles.infoBox}>
                  {/* Simple inline form for editing contact */}
                  {contactFields.map((field) => (
                    <input
                      key={field.value}
                      value={editState?.[field.value] || ""}
                      onChange={e => setEditState(s => ({ ...s, [field.value]: e.target.value }))}
                      placeholder={field.label}
                    />
                  ))}
                  <button onClick={handleEditSave}>Save</button>
                  <button onClick={handleEditCancel}>Cancel</button>
                </div>
              ) : renderInfo(contact)
            }
            {contact.connections && contact.connections.length > 0 && (
              <ul className={styles.treeUl}>
                {contact.connections.map((conn, idx) => (
                  <li key={conn.id || idx} className={styles.treeItem}>
                    <div className={styles.headerRow}>
                      <span
                        className={styles.connectionName}
                        onClick={() => toggleExpand(`${contact.id}-conn-${idx}`)}
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
                    {expanded[`${contact.id}-conn-${idx}`] && (
                      editing?.contactId === contact.id && editing.connIdx === idx ? (
                        <div className={styles.infoBox}>
                          {/* Simple inline form for editing connection */}
                          {contactFields.map((field) => (
                            <input
                              key={field.value}
                              value={editState?.[field.value] || ""}
                              onChange={e => setEditState(s => ({ ...s, [field.value]: e.target.value }))}
                              placeholder={field.label}
                            />
                          ))}
                          <button onClick={handleEditSave}>Save</button>
                          <button onClick={handleEditCancel}>Cancel</button>
                        </div>
                      ) : renderInfo(conn)
                    )}
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
  headerRow: css`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
  `,
  avatarCircle: css`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #008dcd;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.1em;
    margin-right: 10px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  `,
  avatarCircleSmall: css`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #008dcd;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 0.95em;
    margin-right: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  `,
  treeList: css`
    padding: 40px 35px;
    max-width: 900px;
    margin: 0 50px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 141, 205, 0.09);
  `,
  treeUl: css`
    list-style: none;
    padding-left: 1.5em;
    margin: 0;
  `,
  treeItem: css`
    margin-bottom: 0.7em;
    position: relative;
    border-left: 2px solid #e3f3fa;
    padding-left: 0.7em;
    &::before {
      content: "";
      position: absolute;
      left: -1em;
      top: 1.1em;
      width: 1em;
      height: 1px;
      background: #c0bebe;
    }
  `,
  contactName: css`
    font-weight: bold;
    color: #008dcd;
    user-select: none;
    font-size: 1.08em;
    transition: color 0.15s;
    &:hover {
      color: #004e72;
      text-decoration: underline;
    }
  `,
  connectionName: css`
    font-weight: 500;
    color: #004e72;
    margin-left: 8px;
    user-select: none;
    font-size: 1em;
    transition: color 0.15s;
    &:hover {
      color: #008dcd;
      text-decoration: underline;
    }
  `,
  toggleBtn: css`
    font-size: 0.9em;
    margin-left: 8px;
    color: #aaa;
    transition: color 0.15s;
    &:hover {
      color: #008dcd;
    }
  `,
  infoBox: css`
    margin: 8px 0 8px 16px;
    padding: 12px 16px;
    background: none;
    border-radius: 10px;
    box-shadow: none;
    font-size: 1em;
    border-left: none;
  `,
  infoRow: css`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
    color: #333;
  `,
  infoIcon: css`
    font-size: 1.1em;
    color: #008dcd;
  `,
}

export default TreeCard
