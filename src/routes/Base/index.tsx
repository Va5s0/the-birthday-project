import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import { Loading } from "components/Loading"
import { getAuth } from "firebase/auth"
import Cards from "./Cards"

export default function Base() {
  const auth = getAuth()
  const { currentUser } = auth
  const redirectionPath = !!currentUser?.uid ? "/cards" : "/login"

  return (
    <React.Suspense fallback={<Loading />}>
      <Switch>
        <Route path="/cards" component={Cards} />
        <Route path="/">
          <Redirect to={redirectionPath} />
        </Route>
      </Switch>
    </React.Suspense>
  )
}
