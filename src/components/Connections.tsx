import React from "react"
import { IconButton, Collapse } from "@mui/material"
import { css } from "@emotion/css"
import { Common, Contact } from "../models/contact"
import GhostTextInput from "./inputs/GhostTextInput"
import { get } from "lodash/fp"
import CloseIcon from "@mui/icons-material/Close"
import CakeIcon from "@mui/icons-material/Cake"
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar"
import EditIcon from "@mui/icons-material/Edit"
import { dateFormatter } from "../utils/index"

type Props = {
  contact?: Contact
  open: boolean
  editable: boolean
  onDelete: (id?: string) => Promise<void>
  onEditConnection?: (connection: Common) => void
  errors?: Record<string, string>
}

const nameFields = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
]

const Connections = (props: Props) => {
  const { contact, open, editable, onDelete, onEditConnection, errors } = props

  const handleClick = (evt: React.MouseEvent<HTMLInputElement>) =>
    evt?.stopPropagation()

  const handleDelete = (
    evt: React.MouseEvent<HTMLButtonElement>,
    id?: string
  ) => {
    evt?.stopPropagation()
    onDelete(id)
  }

  const handleEditConnection = (connection: Common) => (evt: React.MouseEvent) => {
    evt.stopPropagation()
    onEditConnection?.(connection)
  }

  return (
    <div className={styles.connectionsContainer}>
      <Collapse in={open} timeout={0}>
        <div className={styles.connectionsContent}>
          {contact?.connections?.map((c, cidx) => {
            const fullName = `${c.firstName} ${c?.lastName || ""}`.trim()
            const avatarLetter = (c.firstName?.charAt(0) || "C").toUpperCase()
            
            return (
              <div key={c.id || `connection-${cidx}`} className={styles.connectionCard}>
                <div className={styles.connectionHeader}>
                  <div className={styles.connectionInfo}>
                    <div className={styles.connectionAvatar}>
                      {avatarLetter}
                    </div>
                    <div className={styles.connectionDetails}>
                      {editable ? (
                        <div className={styles.editableNames}>
                          {nameFields.map((nf) => (
                            <GhostTextInput
                              key={`${c.id || cidx}-${nf.value}`}
                              name={`connections.${cidx}.${nf.value}`}
                              placeholder={nf.label}
                              value={
                                (c[nf.value as keyof Common] as string) || ""
                              }
                              onChange={() => {}}
                              onClick={handleClick}
                              className={styles.ghostConnectionInput}
                              error={
                                !!errors &&
                                !!get(`connections.${cidx}.${nf.value}`, errors)
                              }
                              errorMessage={
                                errors
                                  ? get(`connections.${cidx}.${nf.value}`, errors) || ""
                                  : ""
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <div className={styles.connectionContent}>
                          <div className={styles.connectionName}>
                            {fullName}
                          </div>
                          <div className={styles.connectionMeta}>
                            {c.email && (
                              <span className={styles.metaItem}>
                                {c.email}
                              </span>
                            )}
                            {c.phone && (
                              <span className={styles.metaItem}>
                                {c.phone}
                              </span>
                            )}
                          </div>
                          <div className={styles.connectionDates}>
                            {c.birthday && (
                              <div className={styles.dateItem}>
                                <CakeIcon className={styles.dateIcon} />
                                <span className={styles.dateText}>
                                  {dateFormatter(c.birthday)}
                                </span>
                              </div>
                            )}
                            {c.nameday?.date && (
                              <div className={styles.dateItem}>
                                <PermContactCalendarIcon className={styles.dateIcon} />
                                <span className={styles.dateText}>
                                  {dateFormatter(c.nameday.date)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.connectionActions}>
                    {onEditConnection && (
                      <IconButton
                        onClick={handleEditConnection(c)}
                        className={styles.editButton}
                        size="small"
                      >
                        <EditIcon className={styles.editIcon} />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={(e) => handleDelete(e, c?.id)}
                      className={styles.deleteButton}
                      size="small"
                    >
                      <CloseIcon className={styles.deleteIcon} />
                    </IconButton>
                  </div>
                </div>
              </div>
            )
          }) || null}
        </div>
      </Collapse>
    </div>
  )
}

export default Connections

const styles = {
  connectionsContainer: css`
    width: 100%;
    margin-top: 16px;
  `,
  connectionsContent: css`
    /* Content wrapper for collapsed connections */
  `,
  connectionCard: css`
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid var(--border-primary);
    border-radius: 8px;
    margin-bottom: 6px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: rgba(0, 0, 0, 0.04);
      border-color: var(--border-secondary);
    }

    &:last-child {
      margin-bottom: 0;
    }
  `,
  connectionHeader: css`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 12px;
    transition: all 0.2s ease;

    @media (max-width: 768px) {
      padding: 10px;
    }

    @media (max-width: 480px) {
      padding: 8px 10px;
    }
  `,
  connectionInfo: css`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    flex: 1;
    min-width: 0;

    @media (max-width: 768px) {
      gap: 10px;
    }

    @media (max-width: 480px) {
      gap: 8px;
    }
  `,
  connectionAvatar: css`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      var(--primary-main),
      var(--secondary-main)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    flex-shrink: 0;
    margin-top: 2px;

    @media (max-width: 768px) {
      width: 28px;
      height: 28px;
      font-size: 0.75rem;
      margin-top: 1px;
    }

    @media (max-width: 480px) {
      width: 26px;
      height: 26px;
      font-size: 0.7rem;
      margin-top: 1px;
    }
  `,
  connectionDetails: css`
    flex: 1;
    min-width: 0;
  `,
  connectionContent: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  connectionMeta: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  `,
  metaItem: css`
    font-size: 0.8rem;
    color: var(--text-secondary);
    background: rgba(0, 0, 0, 0.05);
    padding: 2px 6px;
    border-radius: 4px;
  `,
  connectionDates: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 6px;
  `,
  dateItem: css`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
    line-height: 1.4;
  `,
  dateIcon: css`
    color: var(--primary-dark);
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  `,
  dateText: css`
    color: var(--text-secondary);
    font-size: 0.75rem;
    line-height: 1.4;
    
    @media (max-width: 480px) {
      font-size: 0.7rem;
    }
  `,
  connectionName: css`
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 2px;
    transition: all 0.3s ease;

    &:hover {
      color: var(--primary-main);
    }
  `,
  editableNames: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  ghostConnectionInput: css`
    max-width: 160px;
    border-radius: 6px;
    padding: 4px 8px;
    color: var(--text-primary);
    background: var(--bg-tertiary);
    font-size: 0.875rem;
    font-weight: 500;

    &::placeholder {
      color: var(--text-tertiary);
    }

    &:focus {
      background: var(--bg-surface);
      border-color: var(--primary-main);
    }
  `,
  connectionActions: css`
    display: flex;
    align-items: center;
    gap: 4px;
  `,
  editButton: css`
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: scale(1.1) rotate(5deg);
    }
  `,
  editIcon: css`
    width: 16px;
    height: 16px;
    color: var(--primary-main);
    transition: all 0.3s ease;

    &:hover {
      color: var(--primary-dark);
      filter: drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3));
    }
  `,
  deleteButton: css`
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: scale(1.1) rotate(-5deg);
    }
  `,
  deleteIcon: css`
    width: 18px;
    height: 18px;
    color: #ef4444;
    transition: all 0.3s ease;

    &:hover {
      color: #dc2626;
      filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3));
    }
  `,
}
