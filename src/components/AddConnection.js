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
import { birthdayFormat } from "../utils/birthdayFormat"
import { validation } from "../utils/validation"
import "react-datepicker/dist/react-datepicker.css"

class AddConnection extends Component {
  constructor() {
    super()
    this.state = {
      newConnection: {
        id: "",
        name: "",
        phone: "",
        birthday: "",
        nameday: {
          nameday_id: "10",
          date: null,
        },
      },
      date: "",

      nameday_date: null, // variable that updates through the 'Nameday' component
      newNameday_id: "10",
      validation_state: {
        controlId_phone: null,
        validationState_phone: null,
      },
      nameChange: "", // variable passed to the 'Nameday' component that updates every time the connection name changes
    }
  }

  // handler to control date change of DatePicker
  handleChange = selected => this.setState({ date: selected })

  // handler to update the nameChange variable every time the connection name changes
  handleNameChange = value => this.setState({ nameChange: this.name.value })

  // handler to update the nameday_date variable each time a new date is selected in the 'Nameday' component
  onNamedayChange = (nameday_date, newNameday_id) =>
    this.setState({ nameday_date, newNameday_id })

  handleSubmit = (e, id) => {
    // sets the birthday date format to a uniform type of DD/MM/YYYY
    const newBirthday = birthdayFormat(this.state.date)
    const { connections } = this.props.parent
    const validatedValues = validation({
      parent: this.state.newConnection,
      firstName: this.name.value,
      phone: this.phone.value,
      newNameday_id: this.state.newNameday_id,
      newNamedate: this.state.nameday_date,
      newBirthday,
    })
    const invalid = validatedValues.validation_state
    const valid_parent = validatedValues.parent_updated

    if (valid_parent !== undefined) {
      const { firstName: name, phone, birthday, nameday } = valid_parent
      this.setState(
        {
          newConnection: {
            id:
              connections.length === 0
                ? 1
                : connections[Object.keys(connections).length - 1].id + 1,
            name,
            phone,
            birthday,
            nameday: {
              nameday_id: nameday.nameday_id,
              date: nameday.date,
            },
          },
        },
        () => {
          let connections = [
            ...this.props.parent.connections,
            this.state.newConnection,
          ]
          this.props.callbackParent(this.props.id, connections)
        }
      )
    } else {
      this.setState({ validation_state: invalid })
    }
    e.preventDefault()
  }

  render() {
    const {
      controlId_phone,
      validationState_phone,
    } = this.state.validation_state
    return (
      <div>
        <div className="font30">
          Add {this.props.parent.firstName} Connection
        </div>
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
                  inputRef={ref => {
                    this.name = ref
                  }}
                  onBlur={this.handleNameChange}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup
              controlId={controlId_phone}
              validationState={validationState_phone}
            >
              <InputGroup>
                <InputGroup.Addon className="glyph-input">
                  <img src="images/phone.png" width="20px" alt="" />
                </InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Add Connection's Phone Number"
                  inputRef={ref => {
                    this.phone = ref
                  }}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className="glyph-input">
                  <img src="images/cake-layered.png" width="20px" alt="" />
                </InputGroup.Addon>
                <DatePicker
                  selected={this.state.date}
                  onChange={this.handleChange}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="Add Connection's Birthday"
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className="glyph-input">
                  <img src="images/calendar.png" width="20px" alt="" />
                </InputGroup.Addon>
                <Nameday
                  name={this.state.nameChange}
                  callbackNameday={this.onNamedayChange}
                  onList={false}
                />
              </InputGroup>
            </FormGroup>

            <Button className="custom-submit" type="submit">
              Submit
            </Button>
          </form>
        </Panel>
      </div>
    )
  }
}

export default AddConnection
