import React, { createContext, useContext, useState, useEffect } from 'react'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode')
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    localStorage.setItem('theme-mode', mode)
    
    // Add transitioning class to disable all transitions
    document.body.classList.add('theme-transitioning')
    
    // Change theme immediately
    document.documentElement.setAttribute('data-theme', mode)
    
    // Force a reflow to ensure the theme change is applied
    document.body.offsetHeight
    
    // Re-enable transitions after theme is applied
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('theme-transitioning')
      })
    })
  }, [mode])

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light')
  }

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode)
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}