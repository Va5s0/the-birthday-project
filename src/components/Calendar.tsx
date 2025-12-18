import React, { useState, useMemo } from "react"
import { css } from "@emotion/css"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import { useContacts } from "../hooks/useContacts"
import { CalendarView } from "./CalendarView"
import { ListView } from "./ListView"
import { extractCelebrationEvents } from "../utils/calendarUtils"

const Calendar = () => {
  const [viewMode, setViewMode] = useState<"month" | "list">("month")
  const { data: contacts = [], isLoading: loading } = useContacts()

  // Extract all celebration events from contacts
  const events = useMemo(() => extractCelebrationEvents(contacts), [contacts])

  const handleViewChange = (
    _: React.MouseEvent<HTMLElement>,
    value: string | null
  ) => {
    if (value !== null) setViewMode(value as "month" | "list")
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <span className={styles.loadingText}>Loading celebrations...</span>
      </div>
    )
  }

  return (
    <>
      <div className={styles.toggleContainer}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="calendar view toggle"
          size="small"
          className={styles.toggleGroup}
        >
          <ToggleButton
            value="month"
            aria-label="month view"
            className={styles.toggleButton}
          >
            ⊟ Month view
          </ToggleButton>
          <ToggleButton
            value="list"
            aria-label="list view"
            className={styles.toggleButton}
          >
            ≡ List view
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {viewMode === "month" ? (
        <CalendarView events={events} />
      ) : (
        <ListView events={events} />
      )}
    </>
  )
}

export default Calendar

const styles = {
  loadingContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 64px 24px;
    min-height: 400px;
  `,

  loadingSpinner: css`
    width: 40px;
    height: 40px;
    border: 3px solid var(--border-primary);
    border-top: 3px solid var(--primary-main);
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `,

  loadingText: css`
    color: var(--text-secondary);
    font-size: 1rem;
    font-weight: 500;
  `,

  toggleContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 32px;
    background-color: var(--bg-primary);
    border-bottom: 1px solid var(--border-primary);
    transition: all 0.3s ease;

    @media (max-width: 768px) {
      padding: 12px 24px;
    }

    @media (max-width: 480px) {
      padding: 12px 16px;
    }
  `,

  toggleGroup: css`
    background: var(--bg-surface);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: 4px;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    gap: 4px;

    @media (max-width: 480px) {
      border-radius: 12px;
    }
  `,

  toggleButton: css`
    border: none !important;
    border-radius: 12px !important;
    padding: 8px 16px !important;
    font-weight: 500 !important;
    font-size: 0.875rem !important;
    color: var(--text-secondary) !important;
    background: transparent !important;
    transition: all 0.3s ease !important;

    &:hover {
      background: var(--bg-tertiary) !important;
      color: var(--text-primary) !important;
    }

    &.Mui-selected {
      background: var(--primary-main) !important;
      color: var(--text-inverse) !important;
      box-shadow: var(--shadow-sm) !important;

      &:hover {
        background: var(--primary-dark) !important;
        color: var(--text-inverse) !important;
      }
    }

    @media (max-width: 480px) {
      padding: 6px 12px !important;
      font-size: 0.8125rem !important;
      border-radius: 10px !important;
    }
  `,
}
