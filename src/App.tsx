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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./styles/global.css"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable auto-refetch on window focus
      retry: 1, // Retry failed requests once
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  )
}
