import React from "react"
import { css, cx } from "emotion"

const classNames = {
  navbarInverse: css`
      background-color: transparent;
      .navbar-brand {
        color: #333;
        font-size: 24px;
        margin-top: 40px;
      `,
  containerFluid: css`
    padding-left: 50px;
  `,
}

const NavigationBar = () => (
  <nav className={cx([classNames.navbarInverse, "navbar"])}>
    <div className={classNames.containerFluid}>
      <div className="navbar-header">
        <a className="navbar-brand" href="#brand">
          The BirthDay Project
        </a>
      </div>
    </div>
  </nav>
)

export default NavigationBar
