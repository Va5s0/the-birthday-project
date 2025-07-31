import React, { ReactNode } from "react"

import IconButton, { IconButtonProps } from "@mui/material/IconButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"

import MoreVertIcon from "@mui/icons-material/MoreVert"
import { css } from "@emotion/css"
import { ListItemText } from "@mui/material"

type Option = {
  label?: string
  icon?: ReactNode
  onClick: (e?: any) => void
}

type Props = {
  options: Option[]
}
function MoreActions(props: Props & IconButtonProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()
    evt.stopPropagation()
    setAnchorEl(evt.currentTarget)
  }

  const handleClosePopUp = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()
    evt.stopPropagation()
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon className={styles.more} />
      </IconButton>

      <Menu
        id="actions-list"
        anchorEl={anchorEl}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted={false}
        open={Boolean(anchorEl)}
        onClose={handleClosePopUp}
      >
        {props.options.map((obj, idx) => (
          <MenuItem
            key={idx}
            data-test-id={`more-actions-${obj.label}`}
            onClick={(evt) => {
              evt.stopPropagation()
              evt.preventDefault()
              obj.onClick()
              setAnchorEl(null)
            }}
            className={styles.listItem}
          >
            <ListItemIcon className={styles.listIcon}>{obj.icon}</ListItemIcon>
            {!!obj?.label ? <ListItemText primary={obj?.label} /> : null}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default MoreActions

const styles = {
  more: css`
    width: 20px;
    height: 20px;
  `,
  listItem: css`
    &.MuiListItemIcon-root {
      min-width: 20px;
    }
    color: var(--dark-grey-3);
    grid-column-gap: 10px;
  `,
  listIcon: css`
    &.MuiListItemIcon-root {
      min-width: 20px;
      width: 20px;
    }
    > svg {
      width: 20px;
      height: 20px;
    }
  `,
}
