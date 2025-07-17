import React from "react"
import {
  collection,
  query,
  onSnapshot,
  FirestoreError,
} from "firebase/firestore"
import { ref, getDownloadURL } from "firebase/storage"
import { Contact } from "../models/contact"
import { db, storage } from "../firebase/fbConfig"
import Card from "./Card/index"
import TreeCard from "./TreeCard"
import { css } from "@emotion/css"
import { getAuth } from "firebase/auth"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"

const Contacts = () => {
  const [contacts, setContacts] = React.useState<Contact[]>([])
  const [, setError] = React.useState<FirestoreError>()
  const [treeView, setTreeView] = React.useState(false)
  const auth = getAuth()
  const { currentUser } = auth

  const contactsRef = query(
    collection(db, `users/${currentUser?.uid}/contacts`)
  )

  const fetchAvatarUrl = async (contactId: string) => {
    if (!currentUser) return undefined
    try {
      const storageRef = ref(
        storage,
        `users/${currentUser?.uid}/contacts/${contactId}/avatar.jpg`
      )
      const url = await getDownloadURL(storageRef)
      return url
    } catch (error) {
      return undefined
    }
  }

  React.useEffect(() => {
    if (currentUser == null) {
      setContacts([])
      return
    }
    const unsubscribe = onSnapshot(
      contactsRef,
      async (snapshot) => {
        const _contacts = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data()
            let avatarUrl = data.avatarUrl // Check if avatarUrl already exists in the data
            if (!!avatarUrl) {
              avatarUrl = await fetchAvatarUrl(doc.id) // Fetch only if avatarUrl exists
            }
            return {
              id: doc.id,
              ...data,
              avatarUrl: avatarUrl || data.avatarUrl || "", // Keep existing avatarUrl if fetch fails
            } as Contact
          })
        )
        setContacts(_contacts)
      },
      (err) => {
        setError(err)
      }
    )
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  return (
    <>
      <div className={styles.toggleContainer}>
        <ToggleButtonGroup
          value={treeView ? "tree" : "cards"}
          exclusive
          onChange={(_, value) => {
            if (value !== null) setTreeView(value === "tree")
          }}
          aria-label="contacts view toggle"
          size="small"
          className={styles.toggleGroup}
        >
          <ToggleButton
            value="cards"
            aria-label="cards view"
            className={styles.toggleButton}
          >
            ⊞ Cards view
          </ToggleButton>
          <ToggleButton
            value="tree"
            aria-label="tree list view"
            className={styles.toggleButton}
          >
            ☰ Tree view
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      {treeView ? (
        <TreeCard contacts={contacts} />
      ) : (
        <div className={styles.container}>
          {contacts?.map((contact, idx) => (
            <Card key={idx} cardKey={idx.toString()} contact={contact} />
          ))}
        </div>
      )}
    </>
  )
}

export default Contacts

const styles = {
  container: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    padding: 32px;
    background-color: var(--bg-primary);
    margin: 0 auto;
    max-width: 1400px;
    transition: background-color 0.3s ease;

    @media (max-width: 1440px) {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 24px;
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      padding: 16px;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 12px;
      padding: 12px;
    }
  `,
  toggleContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 32px;
    background-color: var(--bg-primary);
    border-bottom: 1px solid var(--border-primary);
    transition: all 0.3s ease;
  `,
  toggleGroup: css`
    background: var(--bg-surface);
    border: 1px solid var(--border-primary);
    border-radius: 16px;
    padding: 4px;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    gap: 4px;
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
  `,
}
