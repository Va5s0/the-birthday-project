import React, { useState } from "react"
import {
  Button,
  ListGroup,
  ListGroupItem,
  Collapse,
  Col,
  Glyphicon,
} from "react-bootstrap"
import EditConnection from "./EditConnection"
import AlertDismissable from "./AlertDismissable"
import update from "react-addons-update"
import moment from "moment"
import NamedayListGroup from "./NamedayListGroup"

const ConnectionListItem = props => {
  const [openEdit, setOpenEdit] = useState(false)
  const [year] = useState(
    moment()
      .get("year")
      .toString()
  )
  const [dltConf, setDltConf] = useState(false)

  const handleClose = () => {
    setDltConf(!dltConf)
  }

  const handleDltConf = index => {
    let connections = update(props.parent.connections, {
      $splice: [[index, 1]],
    })
    props.callbackParent(props.id, connections)
    setDltConf(false)
  }

  const handleEditClick = (id, connections) => {
    props.callbackParent(id, connections)
    setOpenEdit(!openEdit)
  }

  const onNamedayChange = (date, id, parent, index) => {
    let newConnection = {
      id: parent.connections[index].id,
      name: parent.connections[index].name,
      phone: parent.connections[index].phone,
      birthday: parent.connections[index].birthday,
      nameday: {
        nameday_id: id,
        date: date,
      },
    }
    let newParent = parent
    newParent.connections = [
      update(parent.connections[index], { $merge: newConnection }),
    ]
    props.updateParent(parent.id, newParent)
  }

  const { connection } = props
  const bdayDate =
    !!connection && !!connection.birthday
      ? new Date(connection.birthday).toLocaleDateString("en-GB")
      : ""
  let connectionItem = (
    <div>
      {" "}
      {props.parent.connections.length !== 0 ? (
        <Col xs={12}>
          <div className="card-effect">
            <h4>{connection.name}</h4>
            <div>
              <ListGroup>
                <ListGroupItem>
                  <img
                    src="images/phone.png"
                    className="glyph"
                    width="35px"
                    alt=""
                  />{" "}
                  {connection.phone}
                </ListGroupItem>
                {!!bdayDate ? (
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
                {moment(connection.nameday.date)
                  .year()
                  .toString() !== year && connection.nameday.date !== null ? (
                  <NamedayListGroup
                    name={connection.name}
                    callbackNamedayChild={onNamedayChange}
                    date={connection.nameday.date}
                    dateId={connection.nameday.nameday_id}
                    parent={props.parent}
                    index={props.index}
                    child={true}
                  />
                ) : connection.nameday.date !== null ? (
                  <ListGroupItem>
                    <img
                      src="images/calendar.png"
                      className="glyph"
                      width="35px"
                      alt=""
                    />{" "}
                    {moment(connection.nameday.date).format("DD/MM/YYYY")}
                  </ListGroupItem>
                ) : null}
              </ListGroup>
            </div>
            <Button className="custom bottomMargin" onClick={handleClose}>
              <Glyphicon glyph="glyphicon glyphicon-remove" />
            </Button>
            {dltConf ? (
              <AlertDismissable
                open={dltConf}
                handleClose={handleClose}
                modalContent="Do you really want to delete this contact?"
              >
                <Button
                  className="connection-button custom"
                  onClick={handleDltConf}
                >
                  Delete
                </Button>
                <Button className="custom" onClick={handleClose}>
                  Cancel
                </Button>
              </AlertDismissable>
            ) : null}
            &nbsp;
            <Button
              className="custom bottomMargin"
              onClick={() => setOpenEdit(!openEdit)}
            >
              <Glyphicon glyph="glyphicon glyphicon-pencil" />
            </Button>
            <Collapse in={openEdit} mountOnEnter={true}>
              <div>
                <EditConnection
                  id={props.parent.id}
                  parent={props.parent}
                  index={props.index}
                  callbackParent={handleEditClick}
                />
              </div>
            </Collapse>
          </div>
        </Col>
      ) : null}
    </div>
  )

  return <div>{connectionItem}</div>
}

export default ConnectionListItem
