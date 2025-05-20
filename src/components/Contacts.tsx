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
import { css } from "@emotion/css"
import { getAuth } from "firebase/auth"

const Contacts = () => {
  const [contacts, setContacts] = React.useState<Contact[]>([])
  const [, setError] = React.useState<FirestoreError>()
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
      <div className={styles.container}>
        {contacts?.map((contact, idx) => (
          <Card key={idx} cardKey={idx.toString()} contact={contact} />
        ))}
      </div>
    </>
  )
}

export default Contacts

const styles = {
  container: css`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 120px 35px 0;
    background-color: var(--light-grey-3);
    overflow: auto;
    @media (max-width: 1461px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 1009px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 557px) {
      grid-template-columns: repeat(1, 1fr);
    }
  `,
}
