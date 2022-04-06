import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import { Loading } from "components/Loading"

const Cards = React.lazy(() => import("./Cards"))

export default function Base() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Switch>
        <Route path="/cards" component={Cards} />
        <Route path="/">
          <Redirect to="/cards" />
        </Route>
      </Switch>
    </React.Suspense>
  )
}
