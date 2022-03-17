import React from "react"
import { create } from "jss"
import {
  createTheme,
  jssPreset,
  StylesProvider,
  ThemeProvider,
} from "@material-ui/core"
import { injectGlobal } from "@emotion/css"

export const theme = createTheme()

const jss = create({
  plugins: [...jssPreset().plugins],
  insertionPoint: document.getElementById("jss-insertion-point")!!,
})

type StylesConfigProps = {
  children: React.ReactNode
}

export function Theme(props: StylesConfigProps) {
  const { children } = props

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StylesProvider>
  )
}

injectGlobal`
  /* Inputs */

  .MuiInputBase-root {
    font-size: 14px;
    line-height: 1rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: black;

    cursor: text;
    display: inline-flex;
    position: relative;
    box-sizing: border-box;
    align-items: center;
  }

  .MuiOutlinedInput-input {
    padding: 16px;
    height: 16px;
  }

  .MuiInputLabel-outlined {
    font-size: 14px;
    transform: translate(14px, 17px) scale(1);
  }

  .MuiInputLabel-outlined.MuiInputLabel-shrink {
    margin: 0;
  }

  .MuiInputLabel-outlined.MuiInputLabel-shrink {
    transform: translate(15px, -6px) scale(0.75);
  }

  .MuiFormControl-marginNormal {
    height: fit-content;
  }

  /*  Typo */
  .MuiTypography-body1 {
    line-height: 1rem;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #808080;
  }

  .MuiTypography-body2 {
    line-height: 1rem;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #808080;
  }

  .MuiTypography-caption {
    line-height: 1rem;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #808080;
  }

`
