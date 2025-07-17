import { useState, useEffect } from "react"
import { Fab } from "@mui/material"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import { css } from "@emotion/css"
import { motion, AnimatePresence } from "framer-motion"

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Check for scroll on the main scrollable container
      const scrollableContainer = document.querySelector(
        '[style*="overflow: auto"]'
      ) as HTMLElement
      const scrollTop = scrollableContainer?.scrollTop || window.pageYOffset

      if (scrollTop > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Listen to scroll events on both window and the scrollable container
    const scrollableContainer = document.querySelector(
      '[style*="overflow: auto"]'
    ) as HTMLElement

    window.addEventListener("scroll", toggleVisibility)
    scrollableContainer?.addEventListener("scroll", toggleVisibility)

    return () => {
      window.removeEventListener("scroll", toggleVisibility)
      scrollableContainer?.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    // Scroll the main scrollable container instead of window
    const scrollableContainer = document.querySelector(
      '[style*="overflow: auto"]'
    ) as HTMLElement

    if (scrollableContainer) {
      scrollableContainer.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className={styles.scrollToTop}
        >
          <Fab
            onClick={scrollToTop}
            className={styles.fab}
            aria-label="scroll to top"
            size="medium"
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const styles = {
  scrollToTop: css`
    position: fixed;
    bottom: 24px;
    left: 24px;
    z-index: 1400;
    pointer-events: auto;
  `,
  fab: css`
    background: linear-gradient(
      135deg,
      var(--primary-main) 0%,
      var(--primary-light) 100%
    );
    color: var(--text-inverse);
    box-shadow: var(--shadow-lg);
    border: none;
    width: 56px;
    height: 56px;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(
        135deg,
        var(--primary-dark) 0%,
        var(--primary-main) 100%
      );
      box-shadow: var(--shadow-xl);
      transform: translateY(-2px) scale(1.05);
    }

    &:active {
      transform: translateY(0) scale(0.95);
    }
  `,
}
