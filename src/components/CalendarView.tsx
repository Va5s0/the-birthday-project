import React, { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import Calendar from "react-calendar"
import type { Value } from "react-calendar/dist/shared/types"
import "react-calendar/dist/Calendar.css"
import { css } from "@emotion/css"
import { Box, Typography, Chip, IconButton } from "@mui/material"
import CakeIcon from "@mui/icons-material/Cake"
import CelebrationIcon from "@mui/icons-material/Celebration"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import {
  CelebrationEvent,
  getEventsForDate,
  calculateAge,
} from "../utils/calendarUtils"

interface CalendarViewProps {
  events: CelebrationEvent[]
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const navigate = useNavigate()

  // Get events for the selected date
  const selectedDateEvents = useMemo(
    () => getEventsForDate(events, selectedDate),
    [events, selectedDate]
  )

  const handleEventClick = (event: CelebrationEvent) => {
    // Navigate to contacts page and scroll to the specific contact
    navigate("/", {
      state: {
        scrollToContactId: event.contactId,
        highlightContact: true,
        // If this is a connection event, pass the connectionId to auto-open connections
        connectionId: event.connectionId,
        isConnection: !!event.connectionId,
      },
    })
  }

  // Add custom content to calendar tiles
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateEvents = getEventsForDate(events, date)
      if (dateEvents.length === 0) return null

      const birthdays = dateEvents.filter((e) => e.type === "birthday").length
      const namedays = dateEvents.filter((e) => e.type === "nameday").length

      return (
        <div className={styles.tileContent}>
          {birthdays > 0 && (
            <div className={styles.eventDot} data-type="birthday">
              {birthdays}
            </div>
          )}
          {namedays > 0 && (
            <div className={styles.eventDot} data-type="nameday">
              {namedays}
            </div>
          )}
        </div>
      )
    }
    return null
  }

  // Add custom class to tiles with events
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateEvents = getEventsForDate(events, date)
      if (dateEvents.length > 0) {
        return styles.hasEvents
      }
    }
    return ""
  }

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value)
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] instanceof Date
    ) {
      setSelectedDate(value[0])
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.calendarContainer}>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={tileContent}
          tileClassName={tileClassName}
          className={styles.calendar}
          locale="en-US"
        />
      </div>

      <div className={styles.selectedDatePanel}>
        <Typography variant="h6" className={styles.selectedDateTitle}>
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Typography>

        {selectedDateEvents.length === 0 ? (
          <Box className={styles.noEvents}>
            <Typography variant="body2" color="textSecondary">
              No celebrations on this day
            </Typography>
          </Box>
        ) : (
          <div className={styles.eventsList}>
            {selectedDateEvents.map((event) => {
              const age =
                event.type === "birthday" && event.date
                  ? calculateAge(event.date)
                  : null

              return (
                <div
                  key={event.id}
                  className={styles.eventItem}
                  onClick={() => handleEventClick(event)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleEventClick(event)
                    }
                  }}
                >
                  <div
                    className={styles.eventIconContainer}
                    data-type={event.type}
                  >
                    {event.type === "birthday" ? (
                      <CakeIcon className={styles.eventIcon} />
                    ) : (
                      <CelebrationIcon className={styles.eventIcon} />
                    )}
                  </div>
                  <div className={styles.eventContent}>
                    <div className={styles.eventHeader}>
                      <Typography variant="body1" className={styles.eventName}>
                        {event.fullName}
                      </Typography>
                      <Chip
                        label={event.type}
                        size="small"
                        className={styles.eventChip}
                        data-type={event.type}
                      />
                    </div>
                    {event.parentName && (
                      <Typography
                        variant="caption"
                        className={styles.eventConnection}
                      >
                        connected to {event.parentName}
                      </Typography>
                    )}
                    {age !== null && age >= 0 && (
                      <Typography variant="caption" className={styles.eventAge}>
                        Turning {age} years old
                      </Typography>
                    )}
                  </div>
                  <IconButton
                    size="small"
                    className={styles.eventAction}
                    aria-label="view contact"
                  >
                    <ArrowForwardIcon fontSize="small" />
                  </IconButton>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: css`
    display: flex;
    gap: 24px;
    padding: 32px;
    background: var(--bg-primary);
    width: 100%;
    margin: 0 auto;

    @media (max-width: 1024px) {
      flex-direction: column;
      padding: 24px;
      gap: 20px;
    }

    @media (max-width: 768px) {
      padding: 16px;
      gap: 16px;
    }

    @media (max-width: 480px) {
      padding: 12px;
      gap: 12px;
    }
  `,

  calendarContainer: css`
    flex: 1;
    background: var(--bg-surface);
    border-radius: 16px;
    padding: 24px;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-primary);

    @media (prefers-color-scheme: light) {
      background: #f8f9fa;
      border-color: rgba(0, 0, 0, 0.12);
    }

    @media (max-width: 768px) {
      padding: 16px;
      border-radius: 12px;
    }

    @media (max-width: 480px) {
      padding: 12px;
      border-radius: 10px;
    }
  `,

  calendar: css`
    width: 100% !important;
    min-width: 350px !important;
    max-width: 100% !important;
    border: 1px solid var(--border-secondary) !important;
    border-radius: 12px;
    padding: 20px;
    font-family: inherit;
    background: transparent !important;

    @media (prefers-color-scheme: light) {
      background: white !important;
      border-color: rgba(0, 0, 0, 0.18) !important;
    }

    @media (max-width: 1024px) {
      padding: 16px;
    }

    @media (max-width: 768px) {
      padding: 12px;
    }

    @media (max-width: 480px) {
      padding: 10px;
    }

    .react-calendar__navigation {
      display: flex;
      margin-bottom: 20px;
      gap: 8px;

      @media (max-width: 768px) {
        margin-bottom: 16px;
        gap: 6px;
      }

      @media (max-width: 480px) {
        margin-bottom: 12px;
        gap: 4px;
      }

      button {
        background: var(--bg-primary);
        border: 1px solid var(--border-primary);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 1.1rem;
        font-weight: 600;
        padding: 14px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;

        @media (prefers-color-scheme: light) {
          background: #f1f3f5;
          border-color: rgba(0, 0, 0, 0.18);
        }

        @media (max-width: 768px) {
          font-size: 1rem;
          padding: 12px;
        }

        @media (max-width: 480px) {
          font-size: 0.9rem;
          padding: 10px;
        }

        &:hover:not(:disabled) {
          background: var(--primary-main);
          color: white;
          border-color: var(--primary-main);
        }

        &:disabled {
          opacity: 0.5;
        }
      }

      .react-calendar__navigation__label {
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;

        @media (max-width: 768px) {
          font-size: 1.1rem;
        }

        @media (max-width: 480px) {
          font-size: 1rem;
        }
      }
    }

    .react-calendar__month-view__weekdays {
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.95rem;
      text-transform: uppercase;
      margin-bottom: 10px;

      @media (prefers-color-scheme: light) {
        color: #495057;
      }

      @media (max-width: 768px) {
        font-size: 0.875rem;
        margin-bottom: 8px;
      }

      @media (max-width: 480px) {
        font-size: 0.8rem;
        margin-bottom: 6px;
      }

      abbr {
        text-decoration: none;
      }
    }

    .react-calendar__month-view__days {
      gap: 6px !important;

      @media (max-width: 768px) {
        gap: 4px !important;
      }

      @media (max-width: 480px) {
        gap: 3px !important;
      }
    }

    .react-calendar__tile {
      background: var(--bg-elevated);
      border: 1px solid var(--border-primary);
      border-radius: 8px;
      color: var(--text-primary);
      padding: 12px 8px;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      position: relative;
      min-height: 60px;

      @media (prefers-color-scheme: light) {
        background: rgba(0, 0, 0, 0.03);
        border-color: rgba(0, 0, 0, 0.15);
      }

      @media (max-width: 768px) {
        padding: 10px 6px;
        font-size: 0.85rem;
      }

      @media (max-width: 480px) {
        padding: 8px 4px;
        font-size: 0.8rem;
      }

      &:hover:not(:disabled) {
        background: var(--bg-secondary);
        border-color: var(--border-secondary);

        @media (prefers-color-scheme: light) {
          background: rgba(0, 0, 0, 0.08);
          border-color: rgba(0, 0, 0, 0.25);
        }
      }

      &.react-calendar__tile--now {
        background: rgba(14, 165, 233, 0.15);
        border-color: var(--primary-main);
        color: var(--primary-main);
        font-weight: 700;

        @media (prefers-color-scheme: light) {
          background: rgba(14, 165, 233, 0.12);
          border-color: #0ea5e9;
        }

        &:hover:not(:disabled) {
          background: rgba(14, 165, 233, 0.22);
          border-color: var(--primary-main);

          @media (prefers-color-scheme: light) {
            background: rgba(14, 165, 233, 0.18);
            border-color: #0ea5e9;
          }
        }
      }

      &.react-calendar__tile--active {
        background: var(--primary-main);
        border-color: var(--primary-dark);
        color: white;
        font-weight: 600;

        &:hover:not(:disabled) {
          background: var(--primary-dark);
          border-color: var(--primary-dark);

          @media (prefers-color-scheme: light) {
            background: #0284c7;
            border-color: #0369a1;
          }
        }
      }

      &.react-calendar__month-view__days__day--neighboringMonth {
        background: transparent;
        color: var(--text-tertiary);
        opacity: 0.4;
        border-color: var(--border-primary);

        @media (prefers-color-scheme: light) {
          opacity: 0.5;
          border-color: rgba(0, 0, 0, 0.08);
        }
      }
    }

    abbr {
      text-decoration: none;
    }
  `,

  hasEvents: css`
    font-weight: 600 !important;
  `,

  tileContent: css`
    display: flex;
    gap: 4px;
    justify-content: center;
    margin-top: 4px;
    flex-wrap: wrap;
  `,

  eventDot: css`
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 700;
    color: white;
    padding: 0 4px;

    &[data-type="birthday"] {
      background: linear-gradient(135deg, #2196f3, #1976d2);
    }

    &[data-type="nameday"] {
      background: linear-gradient(135deg, #9c27b0, #7b1fa2);
    }
  `,

  selectedDatePanel: css`
    width: 400px;
    background: var(--bg-surface);
    border-radius: 16px;
    padding: 24px;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-primary);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(
        90deg,
        var(--primary-main) 0%,
        var(--secondary-main) 100%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover::before {
      opacity: 1;
    }

    @media (max-width: 1024px) {
      width: 100%;
    }

    @media (max-width: 768px) {
      padding: 16px;
      border-radius: 12px;
    }

    @media (max-width: 480px) {
      padding: 12px;
      border-radius: 10px;
    }
  `,

  selectedDateTitle: css`
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--border-primary);

    @media (max-width: 480px) {
      font-size: 1rem;
      margin-bottom: 12px;
    }
  `,

  noEvents: css`
    padding: 32px 16px;
    text-align: center;
  `,

  eventsList: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,

  eventItem: css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    background: var(--bg-primary);
    border-radius: 12px;
    border: 1px solid var(--border-primary);
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;

    &:hover {
      background: var(--bg-tertiary);
      border-color: var(--primary-main);
      transform: translateX(4px);
    }

    &:focus-visible {
      outline: 2px solid var(--primary-main);
      outline-offset: 2px;
    }
  `,

  eventIconContainer: css`
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    flex-shrink: 0;
    transition: all 0.3s ease;

    &[data-type="birthday"] {
      background: linear-gradient(135deg, #2196f3, #1976d2);
    }

    &[data-type="nameday"] {
      background: linear-gradient(135deg, #9c27b0, #7b1fa2);
    }

    .eventItem:hover & {
      transform: scale(1.1);
      box-shadow: var(--shadow-sm);
    }
  `,

  eventIcon: css`
    color: white;
    font-size: 1.5rem;
  `,

  eventContent: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  `,

  eventHeader: css`
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: space-between;
  `,

  eventName: css`
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  eventConnection: css`
    font-size: 0.75rem;
    color: var(--text-tertiary);
    font-weight: 500;
  `,

  eventAge: css`
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 600;
    background: var(--bg-surface);
    padding: 2px 8px;
    border-radius: 8px;
    display: inline-block;
    width: fit-content;
  `,

  eventAction: css`
    opacity: 0;
    transition: all 0.3s ease;
    color: var(--primary-main);

    .eventItem:hover & {
      opacity: 1;
      transform: translateX(2px);
    }
  `,

  eventChip: css`
    text-transform: uppercase;
    font-weight: 700;
    font-size: 0.625rem;
    flex-shrink: 0;

    &[data-type="birthday"] {
      background: linear-gradient(135deg, #2196f3, #1976d2);
      color: white;
    }

    &[data-type="nameday"] {
      background: linear-gradient(135deg, #9c27b0, #7b1fa2);
      color: white;
    }
  `,
}
