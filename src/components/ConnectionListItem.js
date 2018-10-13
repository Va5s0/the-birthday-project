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
import AppActions from "../actions/AppActions"
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

  handleDeleteClick = (index, id) => {
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
    AppActions.updateParent(parent._id.$oid, newParent)
  }

  render() {
    const { connection } = this.props

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
                  <ListGroupItem>
                    <img
                      src="images/cake-layered.png"
                      className="glyph"
                      width="35px"
                      alt=""
                    />{" "}
                    {connection.birthday}
                  </ListGroupItem>
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
                  ) : (
                    <ListGroupItem>
                      <img
                        src="images/calendar.png"
                        className="glyph"
                        width="35px"
                        alt=""
                      />{" "}
                      {connection.nameday.date !== null
                        ? moment(connection.nameday.date).format("DD/MM/YYYY")
                        : connection.nameday.date}
                    </ListGroupItem>
                  )}
                </ListGroup>
              </div>
              <Button
                className="custom bottomMargin"
                onClick={this.handleDeleteClick.bind(this, this.props.index)}
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
                    id={this.props.parent._id.$oid}
                    parent={this.props.parent}
                    index={this.props.index}
                    callbackParent={this.handleEditClick.bind(this)}
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
