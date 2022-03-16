import React from "react"
import Header from "components/Header"
import {
  Grid,
  Row,
  Col,
  Button,
  Modal,
  Glyphicon,
  FormGroup,
  FormControl,
} from "react-bootstrap"
import AddParent from "components/AddParent"
import Parents from "components/Parents"
import NavigationBar from "components/NavigationBar"

import "bootstrap/dist/css/bootstrap.min.css"
import "App.css"
import { css } from "emotion"

const classNames = {
  containerDiv: css`
    display: flex;
    justify-content: space-between;
    margin: 15px;
  `,
  formControl: css`
    border: 1px solid #333;
    height: 36px;
  `,
}

const Cards = () => {
  const [openAdd, setOpenAdd] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | undefined>()

  const onOpen = () => setOpenAdd(true)
  // const closeAdd = () => setOpenAdd(false)

  const online = window.navigator.onLine

  function whichErr(err: string) {
    if (err === "404") {
      return <div>This page cannot load</div>
    } else if (!online) {
      return <div>Check your internet connection</div>
    } else if (err === "500") {
      return <div>Internal server error</div>
    } else {
      return <div>Don't know what's happening</div>
    }
  }

  return !!error ? (
    whichErr(error)
  ) : (
    <div>
      <div>
        <NavigationBar />
      </div>
      <div className="App">
        <Header />
        <Grid>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div className={classNames.containerDiv}>
                <div>
                  <Button className="custom" onClick={onOpen}>
                    <Glyphicon glyph="glyphicon glyphicon-plus" />
                  </Button>
                  {/* <Modal
                      show={openAdd}
                      onHide={closeAdd}
                      keyboard={true}
                    > */}
                  {/* <Modal.Body className="add-modal">
                        <AddParent callbackParent={this.onParentChanged} />
                      </Modal.Body>
                    </Modal> */}
                </div>
                {/* <div>
                    <form onSubmit={this.submitHandler}>
                      <FormGroup
                        controlId={"formControlsText"}
                        onChange={this.onSearchChange}
                      >
                        <FormControl
                          className={classNames.formControl}
                          placeholder="search"
                        />
                      </FormGroup>
                    </form>
                  </div> */}
              </div>
              <div>
                <Parents />
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    </div>
  )
}

export default Cards
