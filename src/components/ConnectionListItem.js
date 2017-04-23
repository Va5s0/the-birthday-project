import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem, Collapse, Col, Glyphicon } from 'react-bootstrap';
import EditConnection from './EditConnection';
import update from 'react-addons-update';

class ConnectionListItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      connections: this.props.parent.connections,
      parent: this.props.parent,
      openEdit: false,
    }
  }

  handleDeleteClick(index, id) {
    let connections = update(this.props.parent.connections, {$splice: [[index, 1]]});
    this.props.callbackParent(this.props.id, connections);
  }

  handleEditClick(id, connections) {
    this.props.callbackParent(id, connections);
    this.setState({ openEdit: !this.state.openEdit})
  }

  render() {
    const {connection} = this.props;

    let connectionItem = <div> {this.props.parent.connections.length !== 0 ?

        <Col xs={12} >

          <h4>{connection.name}</h4>
          <div>
            <ListGroup>
              <ListGroupItem><img src="images/phone.png" className='glyph' width='35px' role="presentation"/> {connection.phone}</ListGroupItem>
              <ListGroupItem><img src="images/cake-layered.png" className='glyph' width='35px' role="presentation"/> {connection.birthday}</ListGroupItem>
              <ListGroupItem><img src="images/calendar.png" className='glyph' width='35px' role="presentation"/> {connection.nameday}</ListGroupItem>
            </ListGroup>
          </div>

          <Button className="custom bottomMargin" onClick={this.handleDeleteClick.bind(this, this.props.index)} ><Glyphicon glyph="glyphicon glyphicon-remove"/></Button>&nbsp;
          <Button className="custom bottomMargin" onClick={ ()=> this.setState({ openEdit: !this.state.openEdit })}>
            <Glyphicon glyph="glyphicon glyphicon-pencil"/>
          </Button>

          <Collapse in={this.state.openEdit}>
            <div>
              <EditConnection id={this.props.parent._id.$oid} parent={this.props.parent} index={this.props.index} callbackParent={this.handleEditClick.bind(this)}/>
            </div>
          </Collapse>

        </Col>:
          null
        }

    </div>

    return (
      <div>
        {connectionItem}
      </div>
    );
  }
}

export default ConnectionListItem;
