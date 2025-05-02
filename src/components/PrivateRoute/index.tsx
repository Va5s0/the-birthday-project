import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

type Props = {
  component: React.ComponentType<any>
}

const PrivateRoute = ({ component: Component }: Props) => {
  const { user, loading } = useAuth() ?? {}

  if (loading) {
    return null
  }

  return user ? <Component /> : <Navigate to="/login" replace />
}

export default PrivateRoute
