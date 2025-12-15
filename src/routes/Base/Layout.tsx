import React, { ReactNode } from "react"
import { useLocation } from "react-router-dom"
import { NavigationBar } from "../../components/NavigationBar"
import TodayWidget from "../../components/TodayWidget"
import { ScrollToTop } from "../../components/ScrollToTop"

import "../../App.css"
import { getNamedayDateForYear } from "src/utils"
import { SnackBar } from "src/components/SnackBar"
import { useAuth } from "../../context/AuthContext"
import { api, Contact, User } from "../../services/api"

type Props = {
  children: ReactNode
}

const Layout = (props: Props) => {
  const { children } = props
  const location = useLocation()
  const { user } = useAuth()
  const [namedaySnackbar, setNamedaySnackbar] = React.useState(false)

  async function updateNamedaysForCurrentYear() {
    try {
      const currentYear = new Date().getFullYear()
      let anyUpdates = false

      // Fetch and update user profile
      const userProfile = await api.getProfile()
      let userNeedsUpdate = false
      const updatedUserData: Partial<User> = {}

      if (userProfile.namedayDate) {
        const savedDate = new Date(userProfile.namedayDate)
        if (savedDate.getFullYear() !== currentYear) {
          // Calculate new date for current year
          const day = savedDate.getDate().toString()
          const month = (savedDate.getMonth() + 1).toString()
          updatedUserData.namedayDate = getNamedayDateForYear({ day, month }, currentYear)
          userNeedsUpdate = true
        }
      }

      if (userNeedsUpdate) {
        await api.updateProfile(updatedUserData)
        anyUpdates = true
      }

      // Fetch and update contacts
      const contacts = await api.getContacts()

      for (const contact of contacts) {
        let contactNeedsUpdate = false
        const updatedContactData: Partial<Contact> = {}

        // Update contact's nameday
        if (contact.namedayDate) {
          const savedDate = new Date(contact.namedayDate)
          if (savedDate.getFullYear() !== currentYear) {
            const day = savedDate.getDate().toString()
            const month = (savedDate.getMonth() + 1).toString()
            updatedContactData.namedayDate = getNamedayDateForYear({ day, month }, currentYear)
            contactNeedsUpdate = true
          }
        }

        // Update contact's connections' namedays
        if (contact.connections && contact.connections.length > 0) {
          const updatedConnections = contact.connections.map((conn) => {
            if (conn.namedayDate) {
              const savedDate = new Date(conn.namedayDate)
              if (savedDate.getFullYear() !== currentYear) {
                const day = savedDate.getDate().toString()
                const month = (savedDate.getMonth() + 1).toString()
                contactNeedsUpdate = true
                return {
                  ...conn,
                  namedayDate: getNamedayDateForYear({ day, month }, currentYear),
                }
              }
            }
            return conn
          })
          updatedContactData.connections = updatedConnections
        }

        if (contactNeedsUpdate) {
          await api.updateContact(contact.id, updatedContactData)
          anyUpdates = true
        }
      }

      if (anyUpdates) {
        setNamedaySnackbar(true)
      }
    } catch (error) {
      console.error("Failed to update namedays:", error)
    }
  }

  React.useEffect(() => {
    if (user) {
      updateNamedaysForCurrentYear()
    }
  }, [user])

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
      <ScrollToTop />
    </div>
  )
}

export default Layout
