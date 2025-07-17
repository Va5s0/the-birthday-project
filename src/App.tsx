import { BrowserRouter, Routes, Route } from "react-router-dom"
import Base from "./routes/Base"
import { Theme } from "./providers/Theme"
import { ThemeProvider } from "./contexts/ThemeContext"
import { ProvideAuth } from "./context/AuthContext"
import { Landing } from "./routes/Auth/Landing"
import { Auth } from "./routes/Auth"
import { ResetConfirmation } from "./routes/Auth/ResetConfirmation"
import { Forgot } from "./routes/Auth/Forgot"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import "./styles/global.css"

export function App() {
  return (
    <ThemeProvider>
      <Theme>
        <ProvideAuth>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <BrowserRouter
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
              <Routes>
                <Route
                  path="/reset"
                  element={<Auth component={ResetConfirmation} />}
                />
                <Route path="/forgot" element={<Auth component={Forgot} />} />
                <Route
                  path="/signup"
                  element={<Auth component={Landing} path="signup" />}
                />
                <Route
                  path="/login"
                  element={<Auth component={Landing} path="login" />}
                />
                <Route path="/*" element={<Base />} />
              </Routes>
            </BrowserRouter>
          </LocalizationProvider>
        </ProvideAuth>
      </Theme>
    </ThemeProvider>
  )
}
