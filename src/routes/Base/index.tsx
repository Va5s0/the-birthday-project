import React from "react"
import { Route, Switch } from "react-router-dom"
import { Loading } from "components/Loading"

// Cards
const Cards = React.lazy(
  () => import(/* webpackChunkName: 'Cards' */ "./Cards")
)

export default function Base() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Switch>
        <Route path="/cards" component={Cards} />
      </Switch>
    </React.Suspense>
  )
}
