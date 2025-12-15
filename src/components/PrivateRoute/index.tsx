import React, { memo } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { CircularProgress } from "@mui/material"

type Props = {
  component: React.ComponentType
}

const PrivateRoute = memo(function PrivateRoute({ component: Component }: Props) {
  const { user, loading } = useAuth() ?? {}

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

  return user ? <Component /> : <Navigate to="/login" replace />
})

export default PrivateRoute
