import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { motion } from 'framer-motion'
import { css } from '@emotion/css'
import { useTheme } from '../contexts/ThemeContext'

// Custom Icons for better dark mode toggle
const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

export const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useTheme()
  const isDark = mode === 'dark'

  return (
    <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={styles.wrapper}
      >
        <IconButton
          onClick={toggleTheme}
          className={styles.toggleButton}
          size="medium"
          aria-label="toggle theme"
        >
          <motion.div
            initial={false}
            animate={{
              rotate: isDark ? 180 : 0,
              scale: isDark ? 0.8 : 1,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            {isDark ? <MoonIcon /> : <SunIcon />}
          </motion.div>
        </IconButton>
      </motion.div>
    </Tooltip>
  )
}

const styles = {
  wrapper: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  toggleButton: css`
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: scale(0.95);
    }
    
    svg {
      transition: all 0.3s ease;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    }
  `,
}