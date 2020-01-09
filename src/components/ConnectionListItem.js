import React, { Component } from "react"
import {
  Button,
  ListGroup,
  ListGroupItem,
  Collapse,
  Col,
  Glyphicon,
} from "react-bootstrap"
import EditConnection from "./EditConnection"
import update from "react-addons-update"
import moment from "moment"
import NamedayListGroup from "./NamedayListGroup"

class ConnectionListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      connections: this.props.parent.connections,
      parent: this.props.parent,
      openEdit: false,
      year: moment()
        .get("year")
        .toString(),
    }
  }

  handleDeleteClick = index => {
    let connections = update(this.props.parent.connections, {
      $splice: [[index, 1]],
    })
    this.props.callbackParent(this.props.id, connections)
  }

  handleEditClick = (id, connections) => {
    this.props.callbackParent(id, connections)
    this.setState({ openEdit: !this.state.openEdit })
  }

  onNamedayChange = (date, id, parent, index) => {
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
    this.props.updateParent(parent.id, newParent)
  }

  render() {
    const { connection } = this.props
    const bdayDate =
      !!connection && !!connection.birthday
        ? new Date(connection.birthday).toLocaleDateString("en-GB")
        : ""
    let connectionItem = (
      <div>
        {" "}
        {this.props.parent.connections.length !== 0 ? (
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
                    .toString() !== this.state.year &&
                  connection.nameday.date !== null ? (
                    <NamedayListGroup
                      name={connection.name}
                      callbackNamedayChild={this.onNamedayChange}
                      date={connection.nameday.date}
                      dateId={connection.nameday.nameday_id}
                      parent={this.props.parent}
                      index={this.props.index}
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
              <Button
                className="custom bottomMargin"
                onClick={this.handleDeleteClick}
              >
                <Glyphicon glyph="glyphicon glyphicon-remove" />
              </Button>
              &nbsp;
              <Button
                className="custom bottomMargin"
                onClick={() =>
                  this.setState({ openEdit: !this.state.openEdit })
                }
              >
                <Glyphicon glyph="glyphicon glyphicon-pencil" />
              </Button>
              <Collapse in={this.state.openEdit} mountOnEnter={true}>
                <div>
                  <EditConnection
                    id={this.props.parent.id}
                    parent={this.props.parent}
                    index={this.props.index}
                    callbackParent={this.handleEditClick}
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
}

export default ConnectionListItem
