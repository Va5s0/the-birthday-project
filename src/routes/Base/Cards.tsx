import React from "react"
import AddContact from "components/AddContact"
import Contacts from "components/Contacts"

import "bootstrap/dist/css/bootstrap.min.css"
import "App.css"
import { css } from "emotion"
import NavigationBar from "components/NavigationBar"
import { IconButton } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"

const Cards = () => {
  const [openAdd, setOpenAdd] = React.useState<boolean>(false)
  // const [error, setError] = React.useState<string | undefined>()

  const onOpen = () => setOpenAdd(true)
  const onClose = () => setOpenAdd(false)

  return (
    <div className={styles.wrapper}>
      <NavigationBar />
      <div>
        <div className={styles.containerDiv}>
          <div>
            <IconButton onClick={onOpen}>
              <AddIcon className={styles.addButton} />
            </IconButton>
          </div>
        </div>
        <Contacts />
        <AddContact open={openAdd} onClose={onClose} />
      </div>
    </div>
  )
}

export default Cards

const styles = {
  wrapper: css`
    display: flex;
    flex-direction: column;
    padding: 0 50px 50px;
  `,
  containerDiv: css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  `,
  formControl: css`
    border: 1px solid var(--dark-grey-2);
    height: 36px;
  `,
  addButton: css`
    font-size: 54px;
    color: var(--primary-main);
  `,
}
