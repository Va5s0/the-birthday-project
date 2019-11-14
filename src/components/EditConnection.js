import React, { Component } from "react"
import {
  Panel,
  FormGroup,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap"
import Nameday from "./Nameday"
import DatePicker from "react-datepicker"
import { validation } from "../utils/validation"
import "react-datepicker/dist/react-datepicker.css"
import { parseISO } from "date-fns"

class EditConnection extends Component {
  constructor(props) {
    super(props)
    const { connections } = this.props.parent
    const index = this.props.index
    this.state = {
      date: connections[index].birthday,
      newNamedate: connections[index].nameday.date, // variable that updates through the 'Nameday' component and fills the form with the current connection nameday
      controlId: null,
      validation_state: {
        controlId_phone: null,
        validationState_phone: null,
      },
      newNameday_id: "",
      nameChange: connections[index].name, // variable passed to the 'Nameday' component that fills the form with the current connection name and updates every time the name changes
    }
  }

  // handler to control date change of DatePicker
  handleChange = selected => this.setState({ date: selected })

  // handler to update the nameChange variable every time the connection name changes
  handleNameChange = value => this.setState({ nameChange: this.name.value })

  // handler to update the newNamedate variable each time a new date is selected in the 'Nameday' component
  onNamedayChange = (date, id) =>
    this.setState({ newNameday_id: id, newNamedate: date })

  handleSubmit = e => {
    // sets the birthday date format to a uniform type of DD/MM/YYYY
    const newBirthday = this.state.date
    const { index } = this.props
    let connections = this.props.parent.connections
    const connection = this.props.parent.connections[index]
    const { id, name: firstName, phone, birthday, nameday } = connection
    const checkConnection = { id, firstName, phone, birthday, nameday }
    const validatedValues = validation({
      parent: checkConnection,
      firstName: this.name.value,
      phone: this.phone.value,
      newNameday_id: this.state.newNameday_id,
      newNamedate: this.state.newNamedate,
      newBirthday,
    })
    const invalid = validatedValues.validation_state
    const valid_connection = validatedValues.parent_updated

    if (valid_connection !== undefined) {
      const { id, firstName: name, phone, birthday, nameday } = valid_connection
      const newConnection = { id, name, phone, birthday, nameday }
      connections[index] = newConnection
      this.props.callbackParent(this.props.id, connections)
    } else {
      this.setState({ validation_state: invalid })
    }
    e.preventDefault()
  }

  render() {
    var datePickerDate
    if (!!this.state.date.length) {
      datePickerDate = (
        <InputGroup>
          <InputGroup.Addon className="glyph-input">
            <img src="images/cake-layered.png" width="20px" alt="" />
          </InputGroup.Addon>
          <DatePicker
            openToDate={parseISO(
              this.props.parent.connections[this.props.index].birthday
            )}
            selected={parseISO(this.state.date)}
            onChange={this.handleChange}
            dateFormat="dd/MM/yyyy"
            className="form-control"
          />
        </InputGroup>
      )
    } else {
      datePickerDate = (
        <InputGroup>
          <InputGroup.Addon className="glyph-input">
            <img src="images/cake-layered.png" width="20px" alt="" />
          </InputGroup.Addon>
          <DatePicker
            selected={parseISO(this.state.date)}
            onChange={this.handleChange}
            dateFormat="dd/MM/yyyy"
            className="form-control"
            placeholderText="Add Connection's Birthday"
          />
        </InputGroup>
      )
    }

    return (
      <div>
        <Panel>
          <form onSubmit={this.handleSubmit}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className="glyph-input">
                  <img src="images/account.png" width="20px" alt="" />
                </InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Add Connection's Name"
                  defaultValue={
                    this.props.parent.connections[this.props.index].name
                  }
                  inputRef={ref => {
                    this.name = ref
                  }}
                  onBlur={this.handleNameChange}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup
              controlId={this.state.controlId}
              validationState={this.state.validationState}
            >
              <InputGroup>
                <InputGroup.Addon className="glyph-input">
                  <img src="images/phone.png" width="20px" alt="" />
                </InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Add Connection's Phone Number"
                  defaultValue={
                    this.props.parent.connections[this.props.index].phone
                  }
                  inputRef={ref => {
                    this.phone = ref
                  }}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>{datePickerDate}</FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className="glyph-input">
                  <img src="images/calendar.png" width="20px" alt="" />
                </InputGroup.Addon>
                <Nameday
                  name={this.state.nameChange}
                  callbackNameday={this.onNamedayChange}
                  dateId={
                    this.props.parent.connections[this.props.index].nameday
                      .nameday_id
                  }
                  date={
                    this.props.parent.connections[this.props.index].nameday.date
                  }
                  onList={false}
                />
              </InputGroup>
            </FormGroup>

            <Button className="custom button-margin-top" type="submit">
              Save
            </Button>
          </form>
        </Panel>
      </div>
    )
  }
}

export default EditConnection
