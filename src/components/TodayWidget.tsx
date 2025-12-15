import { useMemo } from "react"
import { dateFormatter } from "../utils/index"
import { css } from "@emotion/css"
import { motion } from "framer-motion"
import { useContacts } from "../hooks/useContacts"

function isToday(dateString?: string) {
  if (!dateString) return false

  // Create date objects
  const date = new Date(dateString)
  const today = new Date()

  // Compare only month and day (not year) for recurring celebrations
  return (
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

const TodayWidget = () => {
  const { data: contacts = [], isLoading: loading } = useContacts()

  // Find contacts or connections with birthday or nameday today
  const todayContacts = useMemo(() => {
    return contacts.flatMap((contact) => {
      const matches: {
        type: string
        name: string
        date: string
        parent?: string
      }[] = []
      if (isToday(contact.birthday ?? undefined)) {
        matches.push({
          type: "Birthday",
          name: contact.firstName,
          date: contact.birthday!,
          parent: undefined,
        })
      }
      if (isToday(contact.namedayDate ?? undefined)) {
        matches.push({
          type: "Nameday",
          name: contact.firstName,
          date: contact.namedayDate!,
          parent: undefined,
        })
      }
      if (Array.isArray(contact.connections)) {
        contact.connections.forEach((conn) => {
          if (isToday(conn.birthday ?? undefined)) {
            matches.push({
              type: "Birthday",
              name: conn.firstName || "",
              date: conn.birthday!,
              parent: contact.firstName,
            })
          }
          if (isToday(conn.namedayDate ?? undefined)) {
            matches.push({
              type: "Nameday",
              name: conn.firstName || "",
              date: conn.namedayDate!,
              parent: contact.firstName,
            })
          }
        })
      }
      return matches
    })
  }, [contacts])

  if (loading) {
    return (
      <motion.div
        className={styles.widget}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <span className={styles.loadingText}>Loading celebrations...</span>
        </div>
      </motion.div>
    )
  }

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>Today's Celebrations</h3>
          <div className={styles.titleIcon}>🎉</div>
        </div>
        <div className={styles.dateContainer}>
          <span className={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {todayContacts.length === 0 ? (
        <motion.div
          className={styles.empty}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.emptyIcon}>🎈</div>
          <div className={styles.emptyText}>
            <span className={styles.emptyTitle}>No celebrations today</span>
            <span className={styles.emptySubtitle}>
              Enjoy the peaceful day!
            </span>
          </div>
        </motion.div>
      ) : (
        <div className={styles.celebrationsList}>
          {todayContacts.map((item, idx) => (
            <div key={idx} className={styles.celebrationItem}>
              <div className={styles.celebrationIcon}>
                {item.type === "Birthday" ? "🎂" : "🎊"}
              </div>
              <div className={styles.celebrationContent}>
                <div className={styles.celebrationName}>{item.name}</div>
                <div className={styles.celebrationDetails}>
                  {item.parent && (
                    <span className={styles.connectionInfo}>
                      connected to {item.parent}
                    </span>
                  )}
                  <span className={styles.celebrationType}>
                    {item.type} • {dateFormatter(item.date)}
                  </span>
                </div>
              </div>
              <div className={styles.celebrationBadge}>{item.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  widget: css`
    background: var(--bg-surface);
    border-radius: 16px;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-primary);
    padding: 20px;
    margin: 16px 32px 12px 32px;
    max-width: 480px;
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
      box-shadow: var(--shadow-lg);
      transform: translateY(-1px);
      border-color: var(--border-secondary);
    }

    @media (max-width: 1440px) {
      margin: 12px 24px 12px 24px;
    }

    @media (max-width: 768px) {
      margin: 12px 16px 12px 16px;
      padding: 16px;
      border-radius: 12px;
    }

    @media (max-width: 480px) {
      margin: 12px 12px 12px 12px;
      padding: 14px;
      border-radius: 10px;
    }
  `,

  loadingContainer: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px;
  `,

  loadingSpinner: css`
    width: 28px;
    height: 28px;
    border: 2px solid var(--border-primary);
    border-top: 2px solid var(--primary-main);
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
    font-size: 0.875rem;
    font-weight: 500;
  `,

  header: css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    gap: 12px;

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }
  `,

  titleContainer: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  title: css`
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
    letter-spacing: -0.025em;

    @media (max-width: 768px) {
      font-size: 1.125rem;
    }

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  `,

  titleIcon: css`
    font-size: 1.25rem;
    background: linear-gradient(
      135deg,
      var(--primary-main),
      var(--secondary-main)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  `,

  dateContainer: css`
    display: flex;
    padding: 6px 12px;
    background: var(--bg-tertiary);
    border-radius: 8px;
    border: 1px solid var(--border-primary);
  `,

  date: css`
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-secondary);
    white-space: nowrap;

    @media (max-width: 480px) {
      font-size: 0.7rem;
      white-space: normal;
    }
  `,

  empty: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 32px 16px;
    text-align: center;
  `,

  emptyIcon: css`
    font-size: 2rem;
    opacity: 0.6;
  `,

  emptyText: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  emptyTitle: css`
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  `,

  emptySubtitle: css`
    font-size: 0.75rem;
    color: var(--text-secondary);
  `,

  celebrationsList: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 4px;

    /* Custom scrollbar styling */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: var(--bg-tertiary);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--primary-main);
      border-radius: 3px;
      opacity: 0.5;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--primary-dark);
    }

    @media (max-width: 768px) {
      max-height: 350px;
    }

    @media (max-width: 480px) {
      max-height: 300px;
    }
  `,

  celebrationItem: css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--bg-primary);
    border-radius: 12px;
    border: 1px solid var(--border-primary);
    transition: background 0.3s ease, border-color 0.3s ease,
      transform 0.3s ease;

    &:hover {
      background: var(--bg-tertiary);
      border-color: var(--border-secondary);
      transform: translateX(2px);
    }

    @media (max-width: 768px) {
      padding: 10px;
      gap: 10px;
    }

    @media (max-width: 480px) {
      padding: 8px;
      gap: 8px;
      flex-wrap: wrap;
    }
  `,

  celebrationIcon: css`
    font-size: 1.5rem;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-surface);
    border-radius: 8px;
    border: 1px solid var(--border-primary);
    box-shadow: var(--shadow-sm);
  `,

  celebrationContent: css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  `,

  celebrationName: css`
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);

    @media (max-width: 480px) {
      font-size: 0.9375rem;
    }
  `,

  celebrationDetails: css`
    display: flex;
    flex-direction: column;
    gap: 1px;
  `,

  connectionInfo: css`
    font-size: 0.7rem;
    color: var(--text-tertiary);
    font-weight: 500;
  `,

  celebrationType: css`
    font-size: 0.75rem;
    color: var(--text-secondary);
  `,

  celebrationBadge: css`
    padding: 4px 8px;
    background: linear-gradient(
      135deg,
      var(--primary-main),
      var(--primary-light)
    );
    color: var(--text-inverse);
    border-radius: 12px;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    box-shadow: var(--shadow-sm);
    white-space: nowrap;

    @media (max-width: 480px) {
      font-size: 0.625rem;
      padding: 3px 6px;
    }
  `,
}

export default TodayWidget
