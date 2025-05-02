import React from "react"
import { Routes, Route } from "react-router-dom"
import PrivateRoute from "../../components/PrivateRoute"
import { Loading } from "../../components/Loading"
import Layout from "./Layout"
import Contacts from "../../components/Contacts"

export default function Base() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Layout>
        <Routes>
          <Route path="/" element={<PrivateRoute component={Contacts} />} />
        </Routes>
      </Layout>
    </React.Suspense>
  )
}
