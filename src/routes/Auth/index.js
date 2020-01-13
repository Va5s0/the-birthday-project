import React, { lazy, Suspense } from "react"
import { Switch, Route } from "react-router-dom"

import Login from "./Login"
import Loading from "components/Loading"
import ErrorBoundary from "providers/ErrorBoundary"

const Register = lazy(() => import("./Register"))

function Auth() {
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <Switch>
          <Route path="/auth/register" component={Register} />
          <Route path="/auth/login" component={Login} />
          <Route path="/auth" component={Login} />
        </Switch>
      </ErrorBoundary>
    </Suspense>
  )
}

export default Auth
