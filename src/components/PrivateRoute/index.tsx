import React from "react"
import { Redirect, Route, RouteProps } from "react-router-dom"
import { useAuth } from "context/AuthContext"

type Props = RouteProps & {
  component: (props: any) => JSX.Element
}

const PrivateRoute = (props: Props) => {
  const { user, loading } = useAuth() ?? {}
  const { component, ...rest } = props
  const Cmp = component

  return !loading ? (
    <Route
      {...rest}
      render={(props) =>
        !!user ? <Cmp {...props} /> : <Redirect to={{ pathname: "/login" }} />
      }
    />
  ) : null
}

export default PrivateRoute
