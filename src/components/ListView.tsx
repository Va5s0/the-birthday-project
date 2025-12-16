import React, { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { css } from "@emotion/css"
import { Typography, Chip, Box, IconButton } from "@mui/material"
import CakeIcon from "@mui/icons-material/Cake"
import CelebrationIcon from "@mui/icons-material/Celebration"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import {
  CelebrationEvent,
  getUpcomingEvents,
  getNextOccurrenceDate,
  calculateAge,
} from "../utils/calendarUtils"

interface ListViewProps {
  events: CelebrationEvent[]
}

export const ListView: React.FC<ListViewProps> = ({ events }) => {
  const navigate = useNavigate()

  // Get upcoming events for the next 90 days
  const upcomingEvents = useMemo(() => getUpcomingEvents(events, 90), [events])

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

  const groupEventsByDate = (events: CelebrationEvent[]) => {
    const grouped: Record<string, CelebrationEvent[]> = {}

    events.forEach((event) => {
      const nextDate = getNextOccurrenceDate(event)
      const dateKey = nextDate.toISOString().split("T")[0]

      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(event)
    })

    return Object.entries(grouped).sort(
      ([dateA], [dateB]) =>
        new Date(dateA).getTime() - new Date(dateB).getTime()
    )
  }

  const groupedEvents = useMemo(
    () => groupEventsByDate(upcomingEvents),
    [upcomingEvents]
  )

  const getDaysUntilText = (date: Date): string => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)

    const daysUntil = Math.ceil(
      (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysUntil === 0) return "Today"
    if (daysUntil === 1) return "Tomorrow"
    if (daysUntil <= 7) return `In ${daysUntil} days`
    if (daysUntil <= 14)
      return `In ${Math.ceil(daysUntil / 7)} week${
        Math.ceil(daysUntil / 7) > 1 ? "s" : ""
      }`
    return `In ${Math.ceil(daysUntil / 7)} weeks`
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h5" className={styles.title}>
          Upcoming Celebrations
        </Typography>
        <Typography variant="body2" className={styles.subtitle}>
          Next 90 days
        </Typography>
      </div>

      {upcomingEvents.length === 0 ? (
        <Box className={styles.noEvents}>
          <div className={styles.emptyIcon}>🎈</div>
          <Typography variant="h6" className={styles.emptyTitle}>
            No upcoming celebrations
          </Typography>
          <Typography variant="body2" color="textSecondary">
            There are no birthdays or namedays in the next 90 days
          </Typography>
        </Box>
      ) : (
        <div className={styles.eventsList}>
          {groupedEvents.map(([dateKey, dateEvents]) => {
            const date = new Date(dateKey)
            const daysUntilText = getDaysUntilText(date)

            return (
              <div key={dateKey} className={styles.dateGroup}>
                <div className={styles.dateHeader}>
                  <Typography variant="subtitle1" className={styles.dateTitle}>
                    {date.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                  <Chip
                    label={daysUntilText}
                    size="small"
                    className={styles.daysChip}
                    data-urgent={
                      daysUntilText === "Today" || daysUntilText === "Tomorrow"
                    }
                  />
                </div>

                <div className={styles.dateEventsList}>
                  {dateEvents.map((event) => {
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
                            <Typography
                              variant="body1"
                              className={styles.eventName}
                            >
                              {event.fullName}
                            </Typography>
                            <Chip
                              label={event.type}
                              size="small"
                              className={styles.eventTypeChip}
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
                            <Typography
                              variant="caption"
                              className={styles.eventAge}
                            >
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
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 32px;
    background: var(--bg-primary);
    max-width: 900px;
    margin: 0 auto;

    @media (max-width: 768px) {
      padding: 24px;
      gap: 20px;
    }

    @media (max-width: 480px) {
      padding: 16px;
      gap: 16px;
    }
  `,

  header: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-bottom: 16px;
    border-bottom: 2px solid var(--border-primary);
  `,

  title: css`
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);

    @media (max-width: 768px) {
      font-size: 1.375rem;
    }

    @media (max-width: 480px) {
      font-size: 1.25rem;
    }
  `,

  subtitle: css`
    color: var(--text-secondary);
    font-size: 0.875rem;
  `,

  noEvents: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 64px 24px;
    text-align: center;
  `,

  emptyIcon: css`
    font-size: 3rem;
    opacity: 0.6;
    margin-bottom: 8px;
  `,

  emptyTitle: css`
    font-weight: 600;
    color: var(--text-primary);
  `,

  eventsList: css`
    display: flex;
    flex-direction: column;
    gap: 24px;
  `,

  dateGroup: css`
    background: var(--bg-surface);
    border-radius: 16px;
    padding: 20px;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-primary);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: var(--shadow-lg);
      border-color: var(--border-secondary);
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

  dateHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-primary);
    gap: 12px;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  `,

  dateTitle: css`
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  `,

  daysChip: css`
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    font-weight: 600;
    border: 1px solid var(--border-primary);

    &[data-urgent="true"] {
      background: linear-gradient(135deg, #ff6b6b, #ee5a52);
      color: white;
      border: none;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.8;
      }
    }
  `,

  dateEventsList: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,

  eventItem: css`
    display: flex;
    align-items: center;
    gap: 16px;
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

    @media (max-width: 480px) {
      gap: 12px;
      padding: 10px;
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

    @media (max-width: 480px) {
      width: 40px;
      height: 40px;
    }
  `,

  eventIcon: css`
    color: white;
    font-size: 1.5rem;

    @media (max-width: 480px) {
      font-size: 1.25rem;
    }
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
    gap: 12px;
    justify-content: space-between;

    @media (max-width: 480px) {
      flex-wrap: wrap;
      gap: 8px;
    }
  `,

  eventName: css`
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 480px) {
      font-size: 0.9375rem;
    }
  `,

  eventTypeChip: css`
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
    margin-top: 2px;
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
}
