import React, { useState, useContext } from "react"
import {
  Button,
  ListGroup,
  ListGroupItem,
  Col,
  Thumbnail,
  Modal,
  Row,
  Glyphicon,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap"
import AddConnection from "./AddConnection"
import UpdateParent from "./UpdateParent"
import ConnectionListItem from "./ConnectionListItem"
import NamedayListGroup from "./NamedayListGroup"
import AlertDismissable from "./AlertDismissable"
import update from "react-addons-update"
import moment from "moment"

import { FireBaseContext } from "providers/Firebase"

const ParentListItem = props => {
  const { db } = useContext(FireBaseContext)

  const [openUpd8, setOpenUpd8] = useState(false)
  const [openParent, setOpenParent] = useState(false)
  const [openCon, setOpenCon] = useState(false)
  const [year] = useState(
    moment()
      .get("year")
      .toString()
  )
  const [dltConf, setDltConf] = useState(false)

  const closeParent = () => {
    setOpenParent(false)
  }

  const closeUpdate = () => {
    setOpenUpd8(false)
  }

  const openUpdate = () => {
    setOpenUpd8(true)
  }

  const closeCon = () => {
    setOpenCon(false)
  }

  const openConnection = () => {
    setOpenCon(true)
  }

  const handleDeleteClick = () => {
    setDltConf(!dltConf)
  }

  const updateParent = (id, parent) => {
    db.collection("contacts")
      .doc(id)
      .set({ ...parent })
      .then(function() {
        console.log("Document successfully written!")
      })
      .catch(function(error) {
        console.error("Error writing document: ", error)
      })
  }

  let handleDltConf = () => {
    db.collection("contacts")
      .doc(parent.id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!")
      })
      .catch(error => {
        console.error("Error removing document: ", error)
      })
    setDltConf(false)
  }

  const onChildChanged = (id, connections) => {
    let parent = props.parent
    parent.connections = connections
    updateParent(id, parent)
    closeCon()
  }

  const onParentChanged = (id, parent) => {
    updateParent(id, parent)
    closeUpdate()
  }

  const onNamedayChange = (date, id, parent, index) => {
    let newParent = {
      firstName: props.parent.firstName,
      lastName: props.parent.lastName,
      phone: props.parent.phone,
      email: props.parent.email,
      birthday: props.parent.birthday,
      nameday: {
        nameday_id: id,
        date: date,
      },
    }
    updateParent(props.parent.id, update(props.parent, { $merge: newParent }))
  }
  const { parent } = props
  const tooltip = <Tooltip id="modal-tooltip">Add a connection</Tooltip>

  let connectionListItems
  if (parent.connections.length !== 0) {
    connectionListItems = parent.connections.map(connection => {
      return (
        <ConnectionListItem
          key={connection.id}
          connection={connection}
          index={parent.connections.indexOf(connection)}
          parent={parent}
          id={parent.id}
          callbackParent={onChildChanged}
          updateParent={updateParent}
        />
      )
    })
  } else {
    connectionListItems = <ConnectionListItem parent={parent} id={parent.id} />
  }

  let namedayItem
  const parentNameday = parent.nameday.date
  // checks whether the existing year matches the current year
  if (
    moment(parentNameday)
      .year()
      .toString() !== year &&
    parentNameday !== null
  ) {
    namedayItem = (
      <NamedayListGroup
        name={parent.firstName}
        callbackNamedayParent={onNamedayChange}
        date={parentNameday}
        dateId={parent.nameday.nameday_id}
        child={false}
      />
    )
  } else {
    namedayItem = (
      <ListGroupItem>
        <img src="images/calendar.png" className="glyph" width="35px" alt="" />{" "}
        {parentNameday !== null
          ? moment(parentNameday).format("DD/MM/YYYY")
          : parentNameday}
      </ListGroupItem>
    )
  }
  const bdayDate = !!parent.birthday
    ? new Date(parent.birthday).toLocaleDateString("en-GB")
    : ""

  return (
    <div>
      <Col xs={6} md={4} lg={3}>
        <Thumbnail>
          <div className="profile-img-box">
            <img src="images/avatar.png" alt="Avatar" className="profile-img" />
          </div>
          <div className="profile-content-box">
            <div className="profile-content-name">
              <h3
                style={{ cursor: "pointer" }}
                onClick={() => setOpenParent(!openParent)}
              >
                {parent.firstName} {parent.lastName}
              </h3>
            </div>
            <div className="profile-content-buttons">
              <p>
                <Button className="custom" onClick={handleDeleteClick}>
                  {" "}
                  <Glyphicon glyph="glyphicon glyphicon-remove" />{" "}
                </Button>
                {dltConf ? (
                  <AlertDismissable
                    show={dltConf}
                    handleDltConf={handleDltConf}
                    handleDeleteClick={handleDeleteClick}
                  />
                ) : null}
                &nbsp;
                <Button className="custom" onClick={openUpdate}>
                  {" "}
                  <Glyphicon glyph="glyphicon glyphicon-pencil" />{" "}
                </Button>
              </p>
            </div>
          </div>
          <Modal show={openParent} onHide={closeParent} keyboard={true}>
            <Modal.Header>
              <Modal.Title>
                {parent.firstName} {parent.lastName}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="card-modal">
              <div className="parent_card">
                <ListGroup>
                  <ListGroupItem>
                    <img
                      src="images/phone.png"
                      className="glyph"
                      width="35px"
                      alt=""
                    />{" "}
                    {parent.phone}
                  </ListGroupItem>
                  <ListGroupItem>
                    <img
                      src="images/mail-ru.png"
                      className="glyph"
                      width="35px"
                      alt=""
                    />{" "}
                    {parent.email}
                  </ListGroupItem>
                  {bdayDate ? (
                    <ListGroupItem>
                      <img
                        src="images/cake-layered.png"
                        className="glyph"
                        width="35px"
                        alt=""
                      />{" "}
                      {bdayDate}
                    </ListGroupItem>
                  ) : null}
                  {!!parentNameday ? namedayItem : null}
                </ListGroup>
              </div>

              <Row>
                <div>{connectionListItems}</div>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <OverlayTrigger placement="left" overlay={tooltip}>
                <Button
                  className="connection-button custom"
                  onClick={openConnection}
                >
                  <Glyphicon glyph="glyphicon glyphicon-plus" />
                </Button>
              </OverlayTrigger>
              <Button className="custom" onClick={closeParent}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Thumbnail>
      </Col>

      <Modal show={openUpd8} onHide={closeUpdate} keyboard={true}>
        <Modal.Body className="add-modal">
          <UpdateParent
            id={parent.id}
            parent={parent}
            callbackParent={onParentChanged}
          />
        </Modal.Body>
      </Modal>

      <Modal show={openCon} onHide={closeCon} keyboard={true}>
        <Modal.Body className="add-modal">
          <AddConnection
            id={parent.id}
            parent={parent}
            callbackParent={onChildChanged}
          />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ParentListItem
