import React from "react"
import { css } from "@emotion/css"

const styles = {
  shell: css`
    display: flex;
    overflow: hidden;
  `,
  content: css`
    height: 100vh;
    padding: 32px;
    margin: auto;
  `,
}

export type LayoutProps = {
  children: React.ReactNode
}
export function Layout(props: LayoutProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.content}>{props.children}</div>
    </div>
  )
}
