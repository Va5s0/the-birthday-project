import React from "react"
import { create } from "jss"
import { jssPreset, StylesProvider, ThemeProvider } from "@material-ui/core"
import { theme } from "./theme"

const jss = create({
  plugins: [...jssPreset().plugins],
  insertionPoint: document.getElementById("jss-insertion-point")!!,
})

type StylesConfigProps = {
  children: React.ReactNode
}

export function Theme(props: StylesConfigProps) {
  const { children } = props

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StylesProvider>
  )
}
