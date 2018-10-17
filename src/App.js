import * as R from "ramda"
import React, { Component } from "react"
import Header from "./components/Header"
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
import AppActions from "./actions/AppActions"
import AppStore from "./stores/AppStore"
import AddParent from "./components/AddParent"
import Parents from "./components/Parents"
import NavigationBar from "./components/NavigationBar"

import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import { css } from "emotion"

const classNames = {
  containerDiv: css`
    display: flex;
    justify-content: space-between;
    margin: 15px;
  `,
  formControl: css`
    border: 1px solid #668887;
    height: 36px;
  `,
}

let FILTER_TIMER_ID = undefined

class App extends Component {
  constructor() {
    super()
    this.state = {
      filteredParents: undefined,
      openAdd: false,
      searchField: "",
      parents: [],
    }
  }

  componentWillMount() {
    AppStore.addChangeListener(this.onChange)
  }

  componentDidMount() {
    AppActions.getParents()
    const { parents, filteredParents } = this.state

    if (!filteredParents && parents && parents.length) {
      this.setState(state => ({ ...state, filteredParents: parents }))
    }
  }

  componentDidUpdate(prevState) {
    const { parents, filteredParents, searchField } = this.state
    const { searchField: pSearchField } = prevState

    if (!filteredParents && parents && parents.length) {
      this.setState(state => ({ ...state, filteredParents: parents }))
    }

    if (searchField !== pSearchField) {
      FILTER_TIMER_ID && clearTimeout(FILTER_TIMER_ID)
      FILTER_TIMER_ID = setTimeout(this.filterData, 300)
    }
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this.onChange)
    FILTER_TIMER_ID && clearTimeout(FILTER_TIMER_ID)
  }

  onChange = () => this.setState({ parents: AppStore.getParents() })

  onSearchChange = evt => {
    const searchField = evt.target.value
    this.setState(state => ({ ...state, searchField }))
  }

  closeAdd = () => {
    this.setState({ openAdd: false })
  }

  openAdd = () => {
    this.setState({ openAdd: true })
  }

  onParentChanged = () => {
    this.closeAdd()
  }

  filterData = () => {
    const { parents, searchField } = this.state
    // search sanitization
    const sf = searchField.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    const searchRegex = new RegExp(sf, "gi")
    let p = []
    p = R.filter(
      R.anyPass([
        R.compose(
          R.test(searchRegex),
          R.path(["firstName"])
        ),
        R.compose(
          R.test(searchRegex),
          R.path(["lastName"])
        ),
        R.compose(
          R.test(searchRegex),
          R.path(["phone"])
        ),
        R.compose(
          R.test(searchRegex),
          R.converge(R.concat, [
            R.path(["firstName"]),
            R.compose(
              R.concat(" "),
              R.path(["lastName"])
            ),
          ])
        ),
      ]),
      parents
    )
    this.setState(state => ({ ...state, filteredParents: p }))
  }

  submitHandler = e => {
    e.preventDefault()
  }

  render() {
    const { openAdd, filteredParents } = this.state
    return (
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
                    <Button className="custom" onClick={this.openAdd}>
                      <Glyphicon glyph="glyphicon glyphicon-plus" />
                    </Button>
                    <Modal
                      show={openAdd}
                      onHide={this.closeAdd}
                      keyboard={true}
                    >
                      <Modal.Body className="add-modal">
                        <AddParent callbackParent={this.onParentChanged} />
                      </Modal.Body>
                    </Modal>
                  </div>
                  <div>
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
                  </div>
                </div>
                <div>
                  <Parents parents={filteredParents} />
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    )
  }
}

export default App
