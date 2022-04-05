import React from "react"
import { css } from "@emotion/css"
import img from "assets/celebration.jpg"

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

const styles = {
  shell: css`
    display: flex;
    overflow: hidden;
    background: url(${img});
    height: 100vh;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  `,
  content: css`
    margin: auto;
    background-color: var(--white);
    border-top: 3px solid var(--primary-main);
  `,
}
