import React, { Component } from "react"
import {
  Panel,
  FormGroup,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap"
import AppActions from "../actions/AppActions"
import Nameday from "./Nameday"
import DatePicker from "react-datepicker"
import { birthdayFormat } from "../utils/birthdayFormat"
import { validation } from "../utils/validation"
import "react-datepicker/dist/react-datepicker.css"

class AddParent extends Component {
  constructor() {
    super()
    this.state = {
      newParent: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        birthday: "",
        nameday: {
          nameday_id: "10",
          date: null,
        },
        connections: [],
      },
      date: "",
      nameday_date: null, // variable that updates through the 'Nameday' component
      nameday_id: "10",
      validation_state: {
        controlId_phone: null,
        controlId_email: null,
        validationState_phone: null,
        validationState_email: null,
      },
      nameChange: "", // variable passed to the 'Nameday' component that updates every time the firstName changes
    }
  }

  // handler to control date change of DatePicker
  handleChange = selected => this.setState({ date: selected })

  // handler to update the nameChange variable every time the first name changes
  handleNameChange = value =>
    this.setState({ nameChange: this.firstName.value })

  // handler to update the nameday_date variable each time a new date is selected in the 'Nameday' component
  onNamedayChange = (date, id) =>
    this.setState({ nameday_id: id, nameday_date: date })

  handleSubmit = e => {
    // sets the birthday date format to a uniform type of DD/MM/YYYY
    const newBirthday = birthdayFormat(this.state.date)
    const validatedValues = validation({
      parent: this.state.newParent,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      phone: this.phone.value,
      email: this.email.value,
      newNameday_id: this.state.nameday_id,
      newNamedate: this.state.nameday_date,
      newBirthday,
    })
    const invalid = validatedValues.validation_state
    const valid_parent = validatedValues.parent_updated

    if (valid_parent !== undefined) {
      AppActions.addParent(valid_parent)
      this.props.callbackParent()
    } else {
      this.setState({ validation_state: invalid })
    }

    e.preventDefault()
  }

  render() {
    const {
      controlId_phone,
      validationState_phone,
      controlId_email,
      validationState_email,
    } = this.state.validation_state
    return (
      <div>
        <div className="font30">Add a new friend</div>
        <Panel>
          <form onSubmit={this.handleSubmit}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className="glyph-input">
                  <img
                    src="images/account.png"
                    width="20px"
                    alt=""
                  />
                </InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Add First Name"
                  inputRef={ref => {
                    this.firstName = ref
                  }}
                  onBlur={this.handleNameChange}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className="glyph-input">
                  <img
                    src="images/account.png"
                    width="20px"
                    alt=""
                  />
                </InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Add Last Name"
                  inputRef={ref => {
                    this.lastName = ref
                  }}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup
              controlId={controlId_phone}
              validationState={validationState_phone}
            >
              <InputGroup>
                <InputGroup.Addon className="glyph-input">
                  <img
                    src="images/phone.png"
                    width="20px"
                    alt=""
                  />
                </InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Add Phone Number"
                  inputRef={ref => {
                    this.phone = ref
                  }}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup
              controlId={controlId_email}
              validationState={validationState_email}
            >
              <InputGroup>
                <InputGroup.Addon className="glyph-input">
                  <img
                    src="images/mail-ru.png"
                    width="20px"
                    alt=""
                  />
                </InputGroup.Addon>
                <FormControl
                  type="text"
                  placeholder="Add Email"
                  inputRef={ref => {
                    this.email = ref
                  }}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className="glyph-input">
                  <img
                    src="images/cake-layered.png"
                    width="20px"
                    alt=""
                  />
                </InputGroup.Addon>
                <DatePicker
                  selected={this.state.date}
                  onChange={this.handleChange}
                  dateFormat="DD/MM/YYYY"
                  className="form-control"
                  placeholderText="Add Birthday"
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon className="glyph-input">
                  <img
                    src="images/calendar.png"
                    width="20px"
                    alt=""
                  />
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

export default AddParent
