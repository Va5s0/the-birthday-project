import * as React from "react"
import { css, cx } from "@emotion/css"

export const styles = {
  inputRoot: css`
    border: 0;
    padding: 0;
    font-size: inherit;
    background-color: transparent;
    -webkit-appearance: none;
    color: inherit;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;

    &:focus {
      outline: 0;
    }

    ::placeholder {
      color: var(--dark-grey);
    }
  `,
  root: css`
    position: relative;
    box-sizing: border-box;
    display: inline-flex;
    align-items: stretch;

    padding-top: 6px;
    padding-bottom: 6px;
    padding-right: 12px;
    padding-left: 12px;

    font-size: 14px;
    line-height: 20px;

    vertical-align: middle;

    border-radius: 4px;
    border-width: 1px;
    border-style: solid;
    border-color: transparent;

    outline: none;

    transition: border-color 250ms cubic-bezier(0.4, 0, 0.2, 1);

    :not([data-disabled="true"]):hover {
      border-color: var(--dark-grey-2);
    }

    :focus,
    :focus-within {
      border-color: var(--dark-grey-2);
    }
  `,
  fullWidth: css`
    display: block;
    width: 100%;
  `,
  error: css`
    border-color: var(--red);
  `,
}

type GhostTextInputProps = {
  fullWidth?: boolean
  className?: string
  //
  label?: string
  error?: boolean
  errorMessage?: string
}

const GhostTextInput = React.forwardRef(function (
  props: GhostTextInputProps & React.InputHTMLAttributes<HTMLInputElement>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const {
    className,
    fullWidth,
    error = false,
    errorMessage,
    disabled = false,
    id,
    type = "text",
    label,
    ...rest
  } = props

  const wrapperCn = cx(
    "ghost-input-wrapper",
    styles.root,
    { [styles.fullWidth]: fullWidth },
    className,
    { [styles.error]: error }
  )

  const cn = cx("Input", styles.inputRoot, className)

  return (
    <div data-disabled={disabled} data-error={error} className={wrapperCn}>
      <input
        ref={ref}
        type={type}
        id={id}
        aria-label={label}
        disabled={disabled}
        className={cn}
        autoComplete="off"
        {...rest}
      />
    </div>
  )
})

export default GhostTextInput
