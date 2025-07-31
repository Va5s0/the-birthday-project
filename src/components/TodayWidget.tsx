import React from "react"
import { Contact } from "../models/contact"
import { getAuth } from "firebase/auth"
import { collection, query, onSnapshot } from "firebase/firestore"
import { db } from "../firebase/fbConfig"
import { dateFormatter } from "../utils/index"
import { css } from "@emotion/css"
import { motion } from "framer-motion"

function isToday(dateString?: string) {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  return (
    date.getDate() === today.getDate() && date.getMonth() === today.getMonth()
  )
}

const TodayWidget = () => {
  const [contacts, setContacts] = React.useState<Contact[]>([])
  const [loading, setLoading] = React.useState(true)
  const auth = getAuth()
  const { currentUser } = auth

  React.useEffect(() => {
    if (!currentUser) {
      setLoading(false)
      return
    }
    const contactsRef = query(
      collection(db, `users/${currentUser.uid}/contacts`)
    )
    const unsubscribe = onSnapshot(contactsRef, (snapshot) => {
      const _contacts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Contact[]
      setContacts(_contacts)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [currentUser])

  // Find contacts or connections with birthday or nameday today
  const todayContacts = contacts.flatMap((contact) => {
    const matches: {
      type: string
      name: string
      date: string
      parent?: string
    }[] = []
    if (isToday(contact.birthday)) {
      matches.push({
        type: "Birthday",
        name: contact.firstName,
        date: contact.birthday!,
        parent: undefined,
      })
    }
    if (isToday(contact.nameday?.date)) {
      matches.push({
        type: "Nameday",
        name: contact.firstName,
        date: contact.nameday!.date,
        parent: undefined,
      })
    }
    if (Array.isArray(contact.connections)) {
      contact.connections.forEach((conn) => {
        if (isToday(conn.birthday)) {
          matches.push({
            type: "Birthday",
            name: conn.firstName || "",
            date: conn.birthday!,
            parent: contact.firstName,
          })
        }
        if (isToday(conn.nameday?.date)) {
          matches.push({
            type: "Nameday",
            name: conn.firstName || "",
            date: conn.nameday!.date,
            parent: contact.firstName,
          })
        }
      })
    }
    return matches
  })

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
    <motion.div
      className={styles.widget}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
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
        <motion.div
          className={styles.celebrationsList}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {todayContacts.map((item, idx) => (
            <motion.div
              key={idx}
              className={styles.celebrationItem}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
            >
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
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
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
    max-height: 255px;
    position: relative;
    overflow: auto;
    transition: all 0.3s ease;

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
        var(--primary-light) 50%,
        var(--secondary-main) 100%
      );
    }

    &:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-1px);
      border-color: var(--border-secondary);
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
  `,

  celebrationItem: css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--bg-primary);
    border-radius: 12px;
    border: 1px solid var(--border-primary);
    transition: all 0.3s ease;

    &:hover {
      background: var(--bg-tertiary);
      border-color: var(--border-secondary);
      transform: translateX(2px);
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
  `,
}

export default TodayWidget
