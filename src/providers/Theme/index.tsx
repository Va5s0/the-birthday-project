import React, { useMemo } from "react"
import { ThemeProvider, StyledEngineProvider, CssBaseline } from "@mui/material"
import { createAppTheme } from "./theme"
import { useTheme } from "../../contexts/ThemeContext"

type Props = {
  children: React.ReactNode
}

export const Theme = (props: Props) => {
  const { children } = props
  const { mode } = useTheme()
  
  // Memoize theme to prevent unnecessary re-renders
  const theme = useMemo(() => createAppTheme(mode), [mode])
  
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
