import React from "react"
import { Switch } from "react-router-dom"
import PrivateRoute from "components/PrivateRoute"
import { Loading } from "components/Loading"
import Layout from "./Layout"
import Contacts from "components/Contacts"
import { EditProfile } from "components/EditProfile"

export default function Base() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Layout>
        <Switch>
          <PrivateRoute path="/profile" component={EditProfile} />
          <PrivateRoute path="/" component={Contacts} />
        </Switch>
      </Layout>
    </React.Suspense>
  )
}
