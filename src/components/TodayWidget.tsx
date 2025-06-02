import React from "react"
import { Contact } from "../models/contact"
import { getAuth } from "firebase/auth"
import { collection, query, onSnapshot } from "firebase/firestore"
import { db } from "../firebase/fbConfig"
import { dateFormatter } from "../utils/index"
import { css } from "@emotion/css"

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

  if (loading) return <div className={styles.widget}>Loading...</div>

  return (
    <div className={styles.widget}>
      <h3 className={styles.title}>🎉 Today's Celebrations</h3>
      {todayContacts.length === 0 ? (
        <div className={styles.empty}>
          No birthdays or namedays today. Enjoy the day! 🎈
        </div>
      ) : (
        <ul className={styles.list}>
          {todayContacts.map((item, idx) => (
            <li key={idx}>
              <b>{item.name}</b>
              {item.parent ? ` (connection of ${item.parent})` : ""} –{" "}
              {item.type} ({dateFormatter(item.date)})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const styles = {
  widget: css`
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    padding: 40px 48px 40px 32px;
    margin: 24px 0 16px 50px;
    min-width: 260px;
    max-width: 440px;
    border-left: 6px solid #008dcd;
    transition: box-shadow 0.2s;
    &:hover {
      box-shadow: 0 8px 24px rgba(0, 141, 205, 0.13);
    }
  `,
  title: css`
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 18px;
    color: #008dcd;
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: 0.5px;
  `,
  empty: css`
    color: #aaa;
    font-style: italic;
    padding: 18px 0;
    font-size: 1.08rem;
  `,
  list: css`
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 1.08rem;
      &:last-child {
        border-bottom: none;
      }
      b {
        color: #004e72;
      }
    }
  `,
}

export default TodayWidget
