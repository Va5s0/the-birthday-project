import React from "react"
import { ThemeProvider, StyledEngineProvider } from "@mui/material"
import { theme } from "./theme"

type Props = {
  children: React.ReactNode
}

export const Theme = (props: Props) => {
  const { children } = props
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  )
}
