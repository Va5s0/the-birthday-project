import React from "react"
import { IconButton, Collapse } from "@mui/material"
import { css, cx } from "@emotion/css"
import { Common, Contact } from "../models/contact"
import GhostTextInput from "./inputs/GhostTextInput"
import { get } from "lodash/fp"
import { CardInfo } from "./Card/CardInfo"
import CloseIcon from "@mui/icons-material/Close"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import PersonIcon from "@mui/icons-material/Person"

type Props = {
  contact?: Contact
  open: boolean
  editable: boolean
  onDelete: (id?: string) => Promise<void>
  errors?: Record<string, any>
  handleChange: (
    evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
  onContactChange: (contact?: Partial<Contact>) => void
}

const nameFields = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
]

const Connections = (props: Props) => {
  const {
    contact,
    open,
    editable,
    onDelete,
    errors,
    handleChange,
    onContactChange,
    ...rest
  } = props
  const [expanded, setExpanded] = React.useState<string>()

  const handleClick = (evt: React.MouseEvent<HTMLInputElement>) =>
    evt?.stopPropagation()

  const handleDelete = (
    evt: React.MouseEvent<HTMLButtonElement>,
    id?: string
  ) => {
    evt?.stopPropagation()
    onDelete(id)
  }

  return (
    <div className={styles.connectionsContainer}>
      <Collapse in={open} timeout={0}>
        <div className={styles.connectionsContent}>
          {!!contact?.connections?.length && (
            <div className={styles.connectionsHeader}>
              <div className={styles.connectionsTitle}>
                <PersonIcon className={styles.connectionsIcon} />
                <span>
                  {contact.connections.length} connection
                  {contact.connections.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}
          {!!contact?.connections?.length
            ? contact?.connections?.map((c, cidx) => (
                <div key={cidx} className={styles.connectionItem}>
                  <div
                    className={cx(styles.connectionHeader, {
                      [styles.expanded]: expanded === c?.id,
                    })}
                    onClick={() =>
                      setExpanded(expanded === c?.id ? undefined : c?.id)
                    }
                  >
                    <div className={styles.connectionInfo}>
                      <div className={styles.connectionAvatar}>
                        {(c.firstName?.charAt(0) || "C").toUpperCase()}
                      </div>
                      <div className={styles.connectionDetailsInfo}>
                        {editable ? (
                          <div className={styles.editableNames}>
                            {nameFields.map((nf, idx) => (
                              <GhostTextInput
                                key={idx}
                                name={`connections.${cidx}.${nf?.value}`}
                                placeholder={nf?.label}
                                value={
                                  (c[nf?.value as keyof Common] as string) || ""
                                }
                                onChange={handleChange}
                                onClick={handleClick}
                                className={styles.ghostConnectionInput}
                                error={
                                  !!errors &&
                                  !!get(
                                    `connections.${cidx}.${nf?.value}`,
                                    errors
                                  )
                                }
                                errorMessage={
                                  !!errors
                                    ? get(
                                        `connections.${cidx}.${nf?.value}`,
                                        errors
                                      )
                                    : ""
                                }
                              />
                            ))}
                          </div>
                        ) : (
                          <div className={styles.connectionName}>
                            {`${c.firstName} ${c?.lastName || ""}`}
                          </div>
                        )}
                        {!editable && (c.email || c.phone) && (
                          <div className={styles.connectionMeta}>
                            {c.email && (
                              <span className={styles.metaItem}>{c.email}</span>
                            )}
                            {c.phone && (
                              <span className={styles.metaItem}>{c.phone}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.connectionActions}>
                      <IconButton
                        onClick={(e) => handleDelete(e, c?.id)}
                        className={styles.deleteButton}
                        size="small"
                      >
                        <CloseIcon className={styles.deleteIcon} />
                      </IconButton>
                      <IconButton
                        className={cx(styles.expandButton, {
                          [styles.expandedButton]: expanded === c?.id,
                        })}
                        size="small"
                      >
                        <ExpandMoreIcon className={styles.expandIcon} />
                      </IconButton>
                    </div>
                  </div>
                  <Collapse in={expanded === c?.id} timeout={0} mountOnEnter unmountOnExit>
                    <div className={styles.connectionDetails}>
                      <CardInfo
                        contact={contact}
                        editable={editable}
                        errors={errors}
                        index={String(cidx)}
                        onContactChange={onContactChange}
                        isConnection
                        {...rest}
                      />
                    </div>
                  </Collapse>
                </div>
              ))
            : null}
        </div>
      </Collapse>
    </div>
  )
}

export default Connections

const styles = {
  connectionsContainer: css`
    position: absolute;
    width: 100%;
    top: 100%;
    left: 0;
    z-index: 10;
    padding-top: 8px;
  `,
  connectionsContent: css`
    /* Content wrapper for collapsed connections */
  `,
  connectionsHeader: css`
    padding: 8px 16px;
    margin-bottom: 8px;
    background: var(--bg-surface);
    border: 1px solid var(--border-primary);
    border-radius: 8px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  `,
  connectionsTitle: css`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,
  connectionsIcon: css`
    width: 16px;
    height: 16px;
    color: var(--primary-main);
  `,
  connectionItem: css`
    background: var(--bg-surface);
    border: 1px solid var(--border-primary);
    border-radius: 12px;
    margin-bottom: 8px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

    &:hover {
      box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15),
        0 2px 4px 0 rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
      border-color: var(--border-secondary);
    }
  `,
  connectionHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
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
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    &:hover {
      background: var(--bg-secondary);
    }

    @media (max-width: 768px) {
      padding: 10px 12px;
    }

    @media (max-width: 480px) {
      padding: 8px 10px;
    }
  `,
  expanded: css`
    &::after {
      opacity: 1;
    }
  `,
  connectionInfo: css`
    display: flex;
    align-items: center;
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
    width: 36px;
    height: 36px;
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
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    flex-shrink: 0;

    &:hover {
      transform: scale(1.05);
    }

    @media (max-width: 768px) {
      width: 32px;
      height: 32px;
      font-size: 0.8rem;
    }

    @media (max-width: 480px) {
      width: 28px;
      height: 28px;
      font-size: 0.75rem;
    }
  `,
  connectionDetailsInfo: css`
    flex: 1;
    min-width: 0;
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
  connectionMeta: css`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      gap: 6px;
    }

    @media (max-width: 480px) {
      gap: 4px;
    }
  `,
  metaItem: css`
    font-size: 0.8rem;
    color: var(--text-secondary);
    background: var(--bg-tertiary);
    padding: 2px 6px;
    border-radius: 4px;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: 768px) {
      font-size: 0.75rem;
      padding: 1px 4px;
      max-width: 100px;
    }

    @media (max-width: 480px) {
      font-size: 0.7rem;
      padding: 1px 3px;
      max-width: 80px;
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
  expandButton: css`
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: scale(1.1);
    }
  `,
  expandedButton: css`
    transform: rotate(180deg);
  `,
  expandIcon: css`
    width: 18px;
    height: 18px;
    color: var(--primary-main);
    transition: all 0.3s ease;
  `,
  connectionDetails: css`
    padding: 16px;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-primary);

    @media (max-width: 768px) {
      padding: 12px;
    }
  `,
}
