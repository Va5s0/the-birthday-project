import { ReactNode } from "react"
import NavigationBar from "components/NavigationBar"

import "App.css"

type Props = {
  children: ReactNode
}

const Layout = (props: Props) => {
  const { children } = props
  return (
    <>
      <NavigationBar />
      {children}
    </>
  )
}

export default Layout
