import { createTheme } from "@mui/material"
import { css } from "@emotion/css"

export const theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          lineHeight: "1rem",
          fontWeight: "normal",
          fontStretch: "normal",
          fontStyle: "normal",
          letterSpacing: "normal",
          color: "black",
          cursor: "text",
          display: "inline-flex",
          position: "relative",
          boxSizing: "border-box",
          alignItems: "center",
          "&.MuiInputBase-marginDense": {
            paddingLeft: "8px",
            height: "40px",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: "16px",
          height: "16px",
          "&.MuiOutlinedInput-inputMarginDense": {
            display: "flex",
            alignItems: "center",
            padding: "12px 0",
            fontSize: "12px",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          fontSize: "14px",
          transform: "translate(14px, 17px) scale(1)",
          "&.MuiInputLabel-shrink": {
            margin: 0,
            transform: "translate(15px, -6px) scale(0.75)",
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          "& .MuiSvgIcon-root": {
            width: "24px",
            height: "24px",
          },
          "&.MuiInputAdornment-marginDense .MuiSvgIcon-root": {
            width: "16px",
            height: "16px",
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        marginNormal: {
          height: "fit-content",
          backgroundColor: "#fcfcfc",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          color: "var(--black)",
          padding: "8px 0",
          "&:focus": {
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        body1: {
          lineHeight: "1rem",
          fontSize: "14px",
          fontWeight: "normal",
          fontStretch: "normal",
          fontStyle: "normal",
          letterSpacing: "normal",
          color: "var(--dark-grey)",
        },
        body2: {
          lineHeight: "1rem",
          fontSize: "14px",
          fontWeight: "normal",
          fontStretch: "normal",
          fontStyle: "normal",
          letterSpacing: "normal",
          color: "inherit",
        },
        caption: {
          lineHeight: "1rem",
          fontSize: "14px",
          fontWeight: "normal",
          fontStretch: "normal",
          fontStyle: "normal",
          letterSpacing: "normal",
          color: "var(--dark-grey)",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        textColorPrimary: {
          "&.Mui-selected": {
            color: "var(--primary-main)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: "var(--primary-main)",
          "&:hover": {
            backgroundColor: "var(--primary-dark)",
          },
        },
      },
    },
  },
})

css`
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

  .MuiInputBase-root.MuiInputBase-marginDense {
    padding-left: 8px;
    height: 40px;
  }

  .MuiOutlinedInput-input {
    padding: 16px;
    height: 16px;
  }

  .MuiOutlinedInput-input.MuiOutlinedInput-inputMarginDense {
    display: flex;
    align-items: center;
    padding: 12px 0;
    font-size: 12px;
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

  .MuiInputAdornment-root {
    .MuiSvgIcon-root {
      width: 24px;
      height: 24px;
    }
  }

  .MuiInputBase-adornedStart {
    .MuiSelect-icon {
      margin-top: 5px;
    }
  }

  .MuiInputAdornment-marginDense {
    .MuiSvgIcon-root {
      width: 16px;
      height: 16px;
    }
  }

  .MuiFormControl-marginNormal {
    height: fit-content;
    background-color: #fcfcfc;
  }

  .MuiSelect-outlined.MuiSelect-outlined {
    color: var(--black);
    padding: 8px 0;
  }

  .MuiSelect-select:focus {
    background-color: transparent;
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
    color: var(--dark-grey);
  }

  .MuiTypography-body2 {
    line-height: 1rem;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: inherit;
  }

  .MuiTypography-caption {
    line-height: 1rem;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--dark-grey);
  }

  .MuiTab-textColorPrimary.Mui-selected {
    color: var(--primary-main);
  }

  .MuiButton-containedPrimary {
    background-color: var(--primary-main);
    :hover {
      background-color: var(--primary-dark);
    }
  }

  /* Datepicker */
  .MuiPickersDay-daySelected {
    background-color: var(--primary-main);
    color: var(--white);
    :hover {
      background-color: var(--primary-dark);
    }
  }
  .MuiPickersDay-dayDisabled {
    .MuiIconButton-label {
      .MuiTypography-body2 {
        color: var(--light-grey-2);
      }
    }
  }
  .MuiPickersToolbar-toolbar {
    background-color: var(--primary-dark);
  }
`
