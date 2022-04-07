import React from "react"
import { Switch } from "react-router-dom"
import PrivateRoute from "components/PrivateRoute"
import { Loading } from "components/Loading"
import Cards from "./Cards"

export default function Base() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Switch>
        <PrivateRoute path="/" component={Cards} />
      </Switch>
    </React.Suspense>
  )
}
