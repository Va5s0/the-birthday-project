import React, { Component } from 'react';
import Header from './components/Header';
import {Grid, Row, Col, Button, Modal, Glyphicon} from 'react-bootstrap';
import AddParent from './components/AddParent';
import Parents from './components/Parents';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      openAdd: false
    }
  }

  closeAdd() {
   this.setState({ openAdd: false })
  }

  openAdd() {
    this.setState({ openAdd: true });
  }

  onParentChanged(id, parent){
    this.closeAdd();
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Grid>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div>
                <Button id="addButton" className="custom" onClick={this.openAdd.bind(this)}>
                    <Glyphicon glyph="glyphicon glyphicon-plus"/>
                </Button>
                <Modal show={this.state.openAdd} onHide={this.closeAdd.bind(this)} keyboard={true}>
                  <Modal.Body className="add-modal">
                    <AddParent callbackParent={this.onParentChanged.bind(this)}/>
                  </Modal.Body>
                </Modal>
              </div>
              <div>
                <Parents />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
