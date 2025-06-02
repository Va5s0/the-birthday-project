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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "0 0 12px 50px",
        }}
      >
        <ToggleButtonGroup
          value={treeView ? "tree" : "cards"}
          exclusive
          onChange={(_, value) => {
            if (value !== null) setTreeView(value === "tree")
          }}
          aria-label="contacts view toggle"
          size="small"
        >
          <ToggleButton value="cards" aria-label="cards view">
            Cards view
          </ToggleButton>
          <ToggleButton value="tree" aria-label="tree list view">
            Tree list view
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
    grid-template-columns: repeat(4, 1fr);
    justify-content: center;
    padding: 35px;
    background-color: var(--light-grey-3);
    min-height: 100vh;
    margin: 0 auto;
    max-width: 1400px;
    @media (max-width: 1461px) {
      grid-template-columns: repeat(3, 1fr);
      height: inherit;
    }
    @media (max-width: 1009px) {
      grid-template-columns: repeat(2, 1fr);
      height: inherit;
    }
    @media (max-width: 557px) {
      grid-template-columns: repeat(1, 1fr);
      height: inherit;
    }
  `,
  treeList: css`
    padding: 0 35px;
    background-color: var(--light-grey-3);
    min-height: 100vh;
    margin: 0 auto;
    max-width: 1400px;
  `,
  treeUl: css`
    list-style-type: none;
    padding-left: 20px;
  `,
  treeItem: css`
    margin: 8px 0;
  `,
  contactName: css`
    font-weight: 600;
    font-size: 1.1rem;
  `,
  connectionName: css`
    font-weight: 400;
    font-size: 1rem;
    margin-left: 10px;
  `,
}
