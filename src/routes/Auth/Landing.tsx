import React from "react"
import { Tab, Tabs } from "@material-ui/core"
import { css } from "emotion"
import { Login } from "./Login"
import { ReactComponent as Calendar } from "assets/calendar_bday.svg"

export const Landing = () => {
  const [activeTab, setActiveTab] = React.useState(() => "register")

  const handleChange = (event: React.ChangeEvent<{}>, value: any) => {
    setActiveTab(value)
  }

  return (
    <div className={styles.wrapper}>
      <Calendar className={styles.icon} />
      <div className={styles.box}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          TabIndicatorProps={{
            style: {
              display: "none",
            },
          }}
          indicatorColor="primary"
          textColor="primary"
          classes={{
            root: styles.root,
            indicator: styles.selected,
          }}
        >
          <Tab
            label="register"
            value="register"
            classes={{
              root: styles.root,
            }}
          />
          <Tab
            label="login"
            value="login"
            classes={{
              root: styles.root,
            }}
          />
        </Tabs>
        {["register", "login"].map((action, idx) =>
          activeTab === action ? (
            <Login action={action as "register" | "login"} key={idx} />
          ) : null
        )}
      </div>
    </div>
  )
}

const styles = {
  wrapper: css`
    position: relative;
  `,
  icon: css`
    fill: var(--secondary-main);
    opacity: 10%;
    position: fixed;
    width: 50%;
    right: 25%;
  `,
  box: css`
    display: flex;
    flex-direction: column;
    margin: auto;
  `,
  root: css`
    min-height: 32px;
  `,
  selected: css`
    height: 2px;
  `,
}
