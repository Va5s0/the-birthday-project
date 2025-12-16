import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Loading } from "../../components/Loading"
import { CircularProgress } from "@mui/material"
import Layout from "./Layout"
import Contacts from "../../components/Contacts"
import Calendar from "../../components/Calendar"
import { EditProfile } from "../../components/EditProfile"

export default function Base() {
  const { user, loading } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // User is authenticated, render protected routes
  return (
    <React.Suspense fallback={<Loading />}>
      <Layout>
        <Routes>
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/" element={<Contacts />} />
        </Routes>
      </Layout>
    </React.Suspense>
  )
}
