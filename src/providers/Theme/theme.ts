import { createTheme } from "@material-ui/core"
import { injectGlobal } from "@emotion/css"

export const theme = createTheme()

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
    color: var(--dark-grey);
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

  /* Datepicker */
  .MuiPickersDay-daySelected {
    background-color: var(--primary-light);
    :hover {
      background-color: var(--primary-dark);
    }
  }
  .MuiPickersDay-dayDisabled {
    .MuiIconButton-label {
      .MuiTypography-body2 {
        color: var(--light-grey-2)
      }
    }
  }

`
