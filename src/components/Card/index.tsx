import React from "react"
import { doc, deleteDoc } from "firebase/firestore"
import { db } from "firebase/config"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card as MUICard,
  IconButton,
} from "@material-ui/core"
import { css, cx } from "emotion"
import { Contact } from "models/contact"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import { CardInfo } from "./CardInfo"
import MoreActions from "components/MoreActions"

type Props = {
  contact: Contact
}

const Card = (props: Props) => {
  const { contact } = props
  const [expanded, setExpanded] = React.useState<string>()
  const [open, setOpen] = React.useState<boolean>(false)

  const handleChange =
    (id?: string) => (_: React.ChangeEvent<{}>, newExpanded: boolean) => {
      setExpanded(newExpanded ? id : undefined)
    }

  const onOpen = () => setOpen(!open)

  const onEdit = (id?: string) => {}

  const onDelete = async (id?: string) => {
    const contactRef = doc(db, `contacts/${id}`)
    await deleteDoc(contactRef)
  }

  return (
    <div className={cx(styles.wrapper, { [styles.elevated]: open })}>
      <MUICard
        variant={open ? "elevation" : "outlined"}
        className={styles.cardContainer}
        elevation={6}
      >
        <div className={styles.content}>
          <div className={styles.nameRow}>
            <div className={styles.avatarContainer}>
              <AccountCircleIcon className={styles.avatar} />
              <div
                className={styles.name}
              >{`${contact?.firstName} ${contact.lastName}`}</div>
            </div>
            <MoreActions
              options={[
                // EDIT
                {
                  label: "edit",
                  icon: <EditIcon />,
                  onClick: () => onEdit(contact?.id),
                },
                // DELETE
                {
                  label: "delete",
                  icon: <DeleteIcon />,
                  onClick: () => onDelete(contact?.id),
                },
              ]}
            />
          </div>
          <CardInfo contact={contact} />
          {!!contact?.connections?.length ? (
            <div className={styles.connectionsRow}>
              <IconButton onClick={onOpen}>
                <EmojiPeopleIcon className={styles.blueIcon} />
              </IconButton>
            </div>
          ) : null}
        </div>
      </MUICard>
      <div className={styles.connectionsContainer}>
        {!!contact?.connections?.length
          ? contact?.connections?.map((c, cidx) => (
              <Accordion
                key={cidx}
                square
                expanded={expanded === c?.id || false}
                onChange={handleChange(c?.id)}
                classes={{
                  root: cx(styles.accordion, { [styles.invisible]: !open }),
                }}
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                  classes={{
                    root: styles.summaryRoot,
                    content: styles.summaryContent,
                  }}
                >
                  {`${c?.firstName} ${c?.lastName}`}
                </AccordionSummary>
                <AccordionDetails classes={{ root: styles.detailsRoot }}>
                  <CardInfo contact={c} />
                </AccordionDetails>
              </Accordion>
            ))
          : null}
      </div>
    </div>
  )
}

export default Card

const styles = {
  wrapper: css`
    z-index: 300;
    position: relative;
  `,
  cardContainer: css`
    width: 350px;
    min-height: 200px;
    padding: 16px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  `,
  content: css`
    display: flex;
    flex-direction: column;
    grid-row-gap: 20px;
  `,
  nameRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  avatarContainer: css`
    display: flex;
    align-items: center;
    grid-column-gap: 16px;
  `,
  avatar: css`
    width: 48px;
    height: 48px;
  `,
  name: css`
    font-size: 16px;
  `,
  more: css`
    width: 20px;
    height: 20px;
  `,
  connectionsRow: css`
    display: flex;
    justify-content: flex-end;
  `,
  connectionsContainer: css`
    position: absolute;
    width: 100%;
  `,
  accordion: css`
    border-top: none;
    box-shadow: none;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    opacity: 1;
    transition: 0.5s opacity ease;
    box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%),
      0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
    &.Mui-expanded {
      margin: 0;
    }
  `,
  invisible: css`
    opacity: 0;
    transition: 0.5s opacity ease;
    box-shadow: none;
  `,
  summaryRoot: css`
    min-height: 36px;
    background-color: #f72585;
    color: white;
    &.Mui-expanded {
      min-height: 36px;
    }
  `,
  summaryContent: css`
    margin: 8px 0;
    &.Mui-expanded {
      margin: 8px 0;
    }
  `,
  detailsRoot: css`
    padding: 8px 16px 8px;
  `,
  elevated: css`
    z-index: 500;
  `,
  blueIcon: css`
    color: #4361ee;
  `,
}
