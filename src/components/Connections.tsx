import React, { ChangeEvent } from "react"
import { Common } from "models/contact"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
} from "@material-ui/core"
import { css, cx } from "emotion"
import GhostTextInput from "./inputs/GhostTextInput"
import { get } from "lodash/fp"
import { CardInfo } from "./Card/CardInfo"
import CloseIcon from "@material-ui/icons/Close"

type Props = {
  connections?: Common[]
  open: boolean
  editable: boolean
  handleChange: (
    evt: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
  handleDateChange: (date: Date | null, name: string) => void
  onDelete: (id?: string) => Promise<void>
  errors?: Record<string, any>
}

const nameFields = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
]

const Connections = (props: Props) => {
  const {
    connections,
    open,
    editable,
    handleChange,
    handleDateChange,
    onDelete,
    errors,
  } = props
  const [expanded, setExpanded] = React.useState<string>()

  const onExpand =
    (id?: string) => (_: React.ChangeEvent<{}>, newExpanded: boolean) => {
      setExpanded(newExpanded ? id : undefined)
    }

  const handleClick = (evt: React.MouseEvent<HTMLInputElement>) =>
    evt?.stopPropagation()

  const handleDelete = (
    evt: React.MouseEvent<HTMLButtonElement>,
    id?: string
  ) => {
    evt?.stopPropagation()
    onDelete(id)
  }

  return (
    <div className={styles.connectionsContainer}>
      {!!connections?.length
        ? connections?.map((c, cidx) => (
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
                {editable ? (
                  nameFields.map((nf, idx) => (
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
                ) : (
                  <div className={styles.nameContainer}>
                    {`${c?.firstName} ${c?.lastName}`}{" "}
                    <IconButton
                      onClick={(e) => handleDelete(e, c?.id)}
                      classes={{ root: styles.iconButton }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                )}
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
  )
}

export default Connections

const styles = {
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
  nameContainer: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  `,
  ghostConnectionInput: css`
    max-width: 120px;
  `,
  iconButton: css`
    padding: 4px;
    color: var(--white);
  `,
  detailsRoot: css`
    padding: 8px 16px 8px;
  `,
}
