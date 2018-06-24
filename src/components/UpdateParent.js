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
import moment from "moment"

class UpdateParent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: this.props.parent.birthday,
      newNamedate: this.props.parent.date, // variable that updates through the 'Nameday' component and fills the form with the current nameday
      validation_state: {
        controlId_phone: null,
        controlId_email: null,
        validationState_phone: null,
        validationState_email: null,
      },
      newNameday_id: "",
      nameChange: this.props.parent.firstName, // variable passed to the 'Nameday' component that fills the form with the current name and updates every time the firstName changes
    }
  }

  // handler to control date change of DatePicker
  handleChange = selected => this.setState({ date: selected })

  // handler to update the nameChange variable every time the first name changes
  handleNameChange = value =>
    this.setState({ nameChange: this.firstName.value })

  // handler to update the newNamedate variable each time a new date is selected in the 'Nameday' component
  onNamedayChange = (date, id) => {
    this.setState({
      newNameday_id: id,
      newNamedate: date,
    })
  }

  handleSubmit = (e, id) => {
    // sets the birthday date format to a uniform type of DD/MM/YYYY
    const newBirthday = birthdayFormat(this.state.date)
    const validatedValues = validation({
      parent: this.props.parent,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      phone: this.phone.value,
      email: this.email.value,
      newNameday_id: this.state.newNameday_id,
      newNamedate: this.state.newNamedate,
      newBirthday,
    })
    const invalid = validatedValues.validation_state
    const valid_parent = validatedValues.parent_updated

    valid_parent !== undefined
      ? this.props.callbackParent(this.props.id, valid_parent)
      : this.setState({ validation_state: invalid })

    e.preventDefault()
  }

  render() {
    const { parent } = this.props
    const {
      controlId_phone,
      validationState_phone,
      controlId_email,
      validationState_email,
    } = this.state.validation_state

    var datePickerDate
    if (this.state.date.length > 0) {
      datePickerDate = (
        <InputGroup>
          <InputGroup.Addon className="glyph-input">
            <img
              src="images/cake-layered.png"
              width="20px"
              alt=""
            />
          </InputGroup.Addon>
          <DatePicker
            openToDate={moment(parent.birthday, "DD-MM-YYYY")}
            selected={moment(this.state.date, "DD-MM-YYYY")}
            onChange={this.handleChange}
            dateFormat="DD/MM/YYYY"
            className="form-control"
          />
        </InputGroup>
      )
    } else {
      datePickerDate = (
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
      )
    }

    return (
      <div>
        <div className="font30">Edit</div>

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
                  defaultValue={parent.firstName}
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
                  defaultValue={parent.lastName}
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
                  defaultValue={parent.phone}
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
                  defaultValue={parent.email}
                  inputRef={ref => {
                    this.email = ref
                  }}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>{datePickerDate}</FormGroup>
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
                  dateId={this.props.parent.nameday.nameday_id}
                  date={this.props.parent.nameday.date}
                  onList={false}
                />
              </InputGroup>
            </FormGroup>

            <Button className="custom-submit" type="submit">
              Save
            </Button>
          </form>
        </Panel>
      </div>
    )
  }
}

export default UpdateParent
