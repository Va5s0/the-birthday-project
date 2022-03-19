import React, { ChangeEvent } from "react"
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import { db } from "firebase/config"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card as MUICard,
  IconButton,
} from "@material-ui/core"
import { css, cx } from "emotion"
import { Contact, Common } from "models/contact"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import CloseIcon from "@material-ui/icons/Close"
import CheckIcon from "@material-ui/icons/Check"
import { CardInfo } from "./CardInfo"
import MoreActions from "components/MoreActions"
import ConfirmationModal, { ModalInfo } from "components/ConfirmationModal"
import GhostTextInput from "components/inputs/GhostTextInput"
import { get, set } from "lodash/fp"

type Props = {
  contact: Contact
}

const nameFields = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
]

const Card = (props: Props) => {
  const { contact } = props
  const [state, setState] = React.useState<Contact>(contact)
  const [errors, setErrors] = React.useState<Record<string, any>>()
  const [expanded, setExpanded] = React.useState<string>()
  const [open, setOpen] = React.useState<boolean>(false)
  const [modalInfo, setModalInfo] = React.useState<ModalInfo>()
  const [editable, setEditable] = React.useState<boolean>(false)

  const editFbDoc = async () => {
    const contactRef = doc(db, `contacts/${contact?.id}`)
    await updateDoc(contactRef, { ...state }).catch((e) => setErrors(e))
    setEditable(false)
  }

  const deleteFbDoc = async () => {
    const contactRef = doc(db, `contacts/${contact?.id}`)
    await deleteDoc(contactRef)
    setModalInfo(undefined)
  }

  const handleChange = (
    evt: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = evt.target
    const updated = set(name, value, contact)
    setState(updated)
  }

  const handleClick = (evt: React.MouseEvent<HTMLInputElement>) =>
    evt?.stopPropagation()

  const handleDateChange = (date: Date | null, name: string) => {
    const updated = set(name, date?.toISOString(), contact)
    setState(updated)
  }

  const onExpand =
    (id?: string) => (_: React.ChangeEvent<{}>, newExpanded: boolean) => {
      setExpanded(newExpanded ? id : undefined)
    }

  const onOpen = () => setOpen(!open)

  const onEdit = () => {
    setEditable(true)
    setOpen(true)
  }

  const onDelete = async () => {
    setModalInfo({
      title: "Delete Contact",
      type: "destructive",
      description: "Are you sure you want to delete this contact",
      confirmLabel: "Delete",
      onSubmit: deleteFbDoc,
    })
  }

  const onCancelEdit = () => setEditable(false)

  const isModalOpen = Boolean(modalInfo)

  React.useEffect(() => setState(() => contact), [contact])

  return (
    <div className={cx(styles.wrapper, { [styles.elevated]: open })}>
      <MUICard
        variant={open ? "elevation" : "outlined"}
        className={styles.cardContainer}
        elevation={6}
      >
        <div className={styles.content}>
          <div className={styles.firstRowContainer}>
            <div
              className={cx(styles.avatarContainer, {
                [styles.avatarContainerGap]: !editable,
              })}
            >
              <AccountCircleIcon className={styles.avatar} />
              {editable ? (
                <div className={styles.ghostContainer}>
                  {nameFields.map((nf, idx) => (
                    <GhostTextInput
                      key={idx}
                      name={nf?.value}
                      placeholder={nf?.label}
                      value={
                        (state[nf?.value as keyof Contact] as string) || ""
                      }
                      onChange={handleChange}
                      error={!!errors && !!errors[nf?.value]}
                      errorMessage={!!errors ? errors[nf?.value] : ""}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className={styles.name}
                >{`${state?.firstName} ${state.lastName}`}</div>
              )}
            </div>
            {editable ? (
              <div>
                <IconButton aria-label="close" onClick={onCancelEdit}>
                  <CloseIcon className={styles.cancelIcon} />
                </IconButton>
                <IconButton onClick={editFbDoc}>
                  <CheckIcon
                    className={cx(styles.cancelIcon, styles.blueIcon)}
                  />
                </IconButton>
              </div>
            ) : (
              <MoreActions
                options={[
                  // EDIT
                  {
                    label: "edit",
                    icon: <EditIcon />,
                    onClick: onEdit,
                  },
                  // DELETE
                  {
                    label: "delete",
                    icon: <DeleteIcon className={styles.deleteIcon} />,
                    onClick: onDelete,
                  },
                ]}
              />
            )}
          </div>
          <CardInfo
            contact={state}
            editable={editable}
            errors={errors}
            handleChange={handleChange}
            handleDateChange={handleDateChange}
          />
          {!!state?.connections?.length ? (
            <div className={styles.connectionsRow}>
              <IconButton onClick={onOpen}>
                <EmojiPeopleIcon className={styles.blueIcon} />
              </IconButton>
            </div>
          ) : null}
        </div>
      </MUICard>
      <div className={styles.connectionsContainer}>
        {!!state?.connections?.length
          ? state?.connections?.map((c, cidx) => (
              <Accordion
                key={cidx}
                square
                expanded={expanded === c?.id || false}
                onChange={onExpand(c?.id)}
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
                  {editable
                    ? nameFields.map((nf, idx) => (
                        <GhostTextInput
                          key={idx}
                          name={`connections.${cidx}.${nf?.value}`}
                          placeholder={nf?.label}
                          value={(c[nf?.value as keyof Common] as string) || ""}
                          onChange={handleChange}
                          onClick={handleClick}
                          className={styles.ghostConnectionInput}
                          error={
                            !!errors &&
                            !!get(`connections.${cidx}.${nf?.value}`, errors)
                          }
                          errorMessage={
                            !!errors
                              ? get(`connections.${cidx}.${nf?.value}`, errors)
                              : ""
                          }
                        />
                      ))
                    : `${c?.firstName} ${c?.lastName}`}
                </AccordionSummary>
                <AccordionDetails classes={{ root: styles.detailsRoot }}>
                  <CardInfo
                    contact={c}
                    editable={editable}
                    errors={errors}
                    handleChange={handleChange}
                    handleDateChange={handleDateChange}
                    index={String(cidx)}
                  />
                </AccordionDetails>
              </Accordion>
            ))
          : null}
      </div>
      <ConfirmationModal
        open={isModalOpen}
        onCancel={() => setModalInfo(undefined)}
        {...modalInfo}
      />
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
  firstRowContainer: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
  `,
  avatarContainer: css`
    display: flex;
    align-items: center;
  `,
  avatarContainerGap: css`
    grid-column-gap: 16px;
  `,
  avatar: css`
    width: 48px;
    height: 48px;
    color: var(--dark-grey);
  `,
  ghostContainer: css`
    display: flex;
    flex-direction: column;
    max-width: 148px;
  `,
  ghostConnectionInput: css`
    max-width: 120px;
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
    opacity: 1;
    transition: 0.5s opacity ease;
    box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%),
      0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%);
    :last-child {
      margin-bottom: 50px;
    }
    &.Mui-expanded {
      margin: 0;
    }
    &.Mui-expanded:last-child {
      margin-bottom: 50px;
    }
  `,
  invisible: css`
    opacity: 0;
    transition: 0.5s opacity ease;
    box-shadow: none;
  `,
  summaryRoot: css`
    min-height: 36px;
    background-color: var(--secondary-main);
    color: white;
    &.Mui-expanded {
      min-height: 36px;
    }
    &.Mui-focused {
      background-color: var(--secondary-main);
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
    color: var(--primary-main);
  `,
  deleteIcon: css`
    color: var(--red);
  `,
  cancelIcon: css`
    width: 36px;
    height: 36px;
  `,
}
