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
// import img from "assets/tree.jpeg"

const Contacts = () => {
  const [contacts, setContacts] = React.useState<Contact[]>([])
  const [, setError] = React.useState<FirestoreError>()
  const auth = getAuth()
  const { currentUser } = auth

  const contactsRef = query(
    collection(db, `users/${currentUser?.uid}/contacts`)
  )

  const fetchAvatarUrl = async (contactId: string) => {
    try {
      const storageRef = ref(
        storage,
        `users/${currentUser?.uid}/contacts/${contactId}/avatar.jpg`
      )
      return await getDownloadURL(storageRef)
    } catch (error) {
      return undefined
    }
  }

  React.useEffect(() => {
    if (currentUser == null) {
      setContacts([])
    }
    return onSnapshot(
      contactsRef,
      async (snapshot) => {
        const _contacts = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const avatarUrl = await fetchAvatarUrl(doc.id)
            return {
              id: doc.id,
              ...doc.data(),
              avatarUrl,
            } as Contact
          })
        )
        setContacts(_contacts)
      },
      (err) => {
        setError(err)
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])
  console.log({ contacts })

  return (
    <>
      <div className={styles.container}>
        {contacts?.map((contact, idx) => (
          <Card key={idx} contact={contact} />
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
    min-height: calc(100vh - 70px);
    @media (max-width: 1461px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 1009px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 557px) {
      grid-template-columns: repeat(1, 1fr);
    }
    ::before {
      content: "";
      height: 100%;
      width: 100%;
      position: fixed;
      top: 10%;
      left: 25%;
      z-index: 0;
      opacity: 0.05;
      background-size: 800px;
      background-repeat: no-repeat;
    }
  `,
}
