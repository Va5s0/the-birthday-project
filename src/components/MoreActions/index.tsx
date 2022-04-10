import React, { ReactNode } from "react"

import IconButton, { IconButtonProps } from "@material-ui/core/IconButton"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"

import MoreVertIcon from "@material-ui/icons/MoreVert"
import { css } from "emotion"
import { ListItemText } from "@material-ui/core"

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
    color: var(--dark-grey-3);
    grid-column-gap: 10px;
  `,
  listIcon: css`
    min-width: 20px;
    > svg {
      width: 20px;
      height: 20px;
    }
  `,
}
