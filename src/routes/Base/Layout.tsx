import React, { ReactNode } from "react"
import { useLocation } from "react-router-dom"
import { NavigationBar } from "../../components/NavigationBar"
import TodayWidget from "../../components/TodayWidget"

import "../../App.css"
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import { db } from "src/firebase/fbConfig"
import { getNamedayDateForYear } from "src/utils"
import { getAuth } from "firebase/auth"
import { SnackBar } from "src/components/SnackBar"

type Props = {
  children: ReactNode
}

const Layout = (props: Props) => {
  const { children } = props
  const location = useLocation()
  const [namedaySnackbar, setNamedaySnackbar] = React.useState(false)

  async function updateNamedaysForCurrentYear(userId: string) {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) return

    const userData = userSnap.data()
    let needsUpdate = false
    const updatedNameday = { ...userData.nameday }

    if (userData.nameday?.date) {
      const currentYear = new Date().getFullYear()
      const savedDate = new Date(userData.nameday.date)
      if (savedDate.getFullYear() !== currentYear) {
        // Use saved day/month or nameday_id to get new date
        const day = userData.nameday.day || savedDate.getDate().toString()
        const month =
          userData.nameday.month || (savedDate.getMonth() + 1).toString()
        updatedNameday.date = getNamedayDateForYear({ day, month }, currentYear)
        needsUpdate = true
      }
    }

    // If you have connections with namedays, repeat for each connection
    if (Array.isArray(userData.connections)) {
      updatedNameday.connections = userData.connections.map((conn: any) => {
        if (conn.nameday?.date) {
          const currentYear = new Date().getFullYear()
          const savedDate = new Date(conn.nameday.date)
          if (savedDate.getFullYear() !== currentYear) {
            const day = conn.nameday.day || savedDate.getDate().toString()
            const month =
              conn.nameday.month || (savedDate.getMonth() + 1).toString()
            return {
              ...conn,
              nameday: {
                ...conn.nameday,
                date: getNamedayDateForYear({ day, month }, currentYear),
              },
            }
          }
        }
        return conn
      })
      needsUpdate = true
    }

    const contactsRef = collection(db, "users", userId, "contacts")
    const contactsSnap = await getDocs(contactsRef)
    const batchUpdates: { ref: any; data: any }[] = []

    contactsSnap.forEach((docSnap) => {
      const contactData = docSnap.data()
      let contactNeedsUpdate = false
      const updatedContact: any = { ...contactData }

      // Update contact's nameday
      if (contactData.nameday?.date) {
        const currentYear = new Date().getFullYear()
        const savedDate = new Date(contactData.nameday.date)
        if (savedDate.getFullYear() !== currentYear) {
          const day = contactData.nameday.day || savedDate.getDate().toString()
          const month =
            contactData.nameday.month || (savedDate.getMonth() + 1).toString()
          updatedContact.nameday = {
            ...contactData.nameday,
            date: getNamedayDateForYear({ day, month }, currentYear),
          }
          contactNeedsUpdate = true
        }
      }

      // Update contact's connections' namedays
      if (Array.isArray(contactData.connections)) {
        updatedContact.connections = contactData.connections.map(
          (conn: any) => {
            if (conn.nameday?.date) {
              const currentYear = new Date().getFullYear()
              const savedDate = new Date(conn.nameday.date)
              if (savedDate.getFullYear() !== currentYear) {
                const day = conn.nameday.day || savedDate.getDate().toString()
                const month =
                  conn.nameday.month || (savedDate.getMonth() + 1).toString()
                contactNeedsUpdate = true
                return {
                  ...conn,
                  nameday: {
                    ...conn.nameday,
                    date: getNamedayDateForYear({ day, month }, currentYear),
                  },
                }
              }
            }
            return conn
          }
        )
      }

      if (contactNeedsUpdate) {
        batchUpdates.push({
          ref: docSnap.ref,
          data: updatedContact,
        })
      }
    })

    // Apply updates
    if (needsUpdate) {
      await updateDoc(userRef, { nameday: updatedNameday })
    }
    for (const update of batchUpdates) {
      await updateDoc(update.ref, update.data)
    }
    if (needsUpdate || batchUpdates.length > 0) {
      setNamedaySnackbar(true) // Show snackbar when update happens
    }
  }

  React.useEffect(() => {
    const auth = getAuth()
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        updateNamedaysForCurrentYear(user.uid)
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <NavigationBar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        {location.pathname !== '/profile' && <TodayWidget />}
        {children}
      </div>
      <SnackBar
        open={namedaySnackbar}
        onClose={() => setNamedaySnackbar && setNamedaySnackbar(false)}
        message="Some namedays were outdated and have been updated for the current year."
        severity="info"
      />
    </div>
  )
}

export default Layout
