import { AppBar, Button, Fab, Toolbar, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { css, keyframes } from "@emotion/css"
import AddIcon from "@mui/icons-material/Add"
import AddContact from "./AddContact"
import { useState } from "react"
import { motion } from "framer-motion"

export const NavigationBar = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <>
      <AppBar position="sticky" className={styles.appBar} elevation={0}>
        <Toolbar className={styles.toolbar}>
          <motion.div
            className={styles.titleContainer}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              color="inherit"
              onClick={() => navigate("/")}
              className={styles.title}
            >
              <Typography variant="h4" className={styles.titleText}>
                The Birthday Project
              </Typography>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => setOpen(true)}
              size="medium"
              className={styles.addButton}
            >
              <AddIcon />
            </Fab>
          </motion.div>
        </Toolbar>
      </AppBar>
      <AddContact open={open} onClose={() => setOpen(false)} type="contact" />
    </>
  )
}

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.2);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(147, 51, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(147, 51, 234, 0);
  }
`

const styles = {
  appBar: css`
    background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%);
    color: white;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  `,
  toolbar: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    min-height: 64px;
  `,
  titleContainer: css`
    display: flex;
    align-items: center;
    cursor: pointer;
  `,
  title: css`
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(5px);
    }
  `,
  titleText: css`
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-weight: 700;
    font-size: 1.75rem;
    letter-spacing: -0.5px;
    line-height: 1.2;
    text-transform: none;
    background: linear-gradient(to right, #ffffff, #e2e8f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  `,
  addButton: css`
    background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
    color: #9333ea;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    animation: ${pulse} 2s infinite;
    &:hover {
      background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 8px rgba(147, 51, 234, 0.2);
    }
  `,
}
