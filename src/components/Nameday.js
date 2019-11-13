import React, { Component } from "react"
import AppActions from "../actions/AppActions"
import AppStore from "../stores/AppStore"
import { FormControl } from "react-bootstrap"
import DatePicker from "react-datepicker"
import Easter from "./Easter"
import moment from "moment"
import "react-datepicker/dist/react-datepicker.css"

const datePickerComp = (date, handleChange, handleOnBlur, now) => (
  <DatePicker
    fixedHeight
    selected={Date.parse(date)}
    onChange={handleChange}
    dateFormat="dd/MM/yyyy"
    isClearable={true}
    onBlur={handleOnBlur}
    className="form-control"
    minDate={new Date(now, 0, 1)}
    maxDate={new Date(now, 12, 31)}
    placeholderText="Add NameDay"
  />
)

class Nameday extends Component {
  constructor(props) {
    super(props)
    this.state = {
      saints: [],
      easterSaints: [],
      specialEasterSaints: [],
      newDate: this.props.date,
      value: this.props.dateId,
      onList: this.props.onList,
    }
  }

  componentWillMount() {
    AppStore.addChangeListener(this.onChange)
  }

  componentDidMount() {
    AppActions.getNames()
    AppActions.getEasterNames()
    AppActions.getSpecialEasterNames()
  }

  onChange = () => {
    this.setState({
      saints: AppStore.getNames(),
      easterSaints: AppStore.getEasterNames(),
      specialEasterSaints: AppStore.getSpecialEasterNames(),
    })
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this.onChange)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state !== nextState ||
      this.props.name !== nextProps.name ||
      this.props.date !== nextProps.date
    ) {
      return true
    } else {
      return false
    }
  }

  // passes the target value to the linked component ('AddParent', 'AddConnection', 'UpdateParent', 'EditConnection') every time the value changes
  handleOption = e => {
    if (this.props.name !== "") {
      this.setState({ value: e.target.value })
      for (let node of e.target.children) {
        if (node.value === e.target.value) {
          var id = node.getAttribute("data-id")
          break
        }
      }
      this.props.callbackNameday(moment(e.target.value, "DD/MM/YYYY"), id)
    } else {
      this.props.callbackNameday("", "10")
    }
  }

  // handler to control date change of DatePicker
  handleChange = selected => {
    this.setState({ newDate: selected })
    this.props.callbackNameday(selected, "10")
  }

  selectDate = () => {
    const { name } = this.props
    const {
      saints,
      easterSaints,
      specialEasterSaints,
      value,
      newDate,
    } = this.state
    let firstName = name // updates the first name of the parent or the parent connection
    let dates = []
    let easterDates = []
    let option
    let options
    let now = moment().get("year")

    // checks if there is an existing name
    if (firstName !== "") {
      // searches the 'recurring_namedays' json file
      saints.forEach((saint, i) => {
        saint.names.forEach((name, j) => {
          if (name === firstName) {
            dates.push(saint.date + "/" + now)
          }
          return dates
        })
      })
      // searches the 'relative_to_easter' json file
      easterSaints.forEach((easterSaint, l) => {
        easterSaint.variations.forEach((easterName, m) => {
          if (easterName === firstName) {
            easterDates.push(easterSaint.toEaster)
            dates.push(
              moment(Easter(now).props.children)
                .add(easterDates[0], "day")
                .format("DD/MM/YYYY")
            )
          }
          return dates
        })
      })
      // searches the 'recurring_special_namedays' json file
      specialEasterSaints.forEach((saint, i) => {
        saint.names.forEach((name, j) => {
          if (name === firstName) {
            var special_saint = moment([
              moment().get("year"),
              0,
              parseInt(saint.date.slice(0, 2), 10),
            ])
            var easter = moment([
              moment().get("year"),
              0,
              parseInt(
                moment(Easter(now).props.children)
                  .format("DD/MM/YYYY")
                  .slice(0, 2),
                10
              ),
            ])
            if (easter.diff(special_saint, "days") >= 0) {
              easterDates.push(saint.toEaster)
              dates.push(
                moment(Easter(now).props.children)
                  .add(easterDates[0], "day")
                  .format("DD/MM/YYYY")
              )
            } else {
              dates.push(saint.date + "/" + now)
            }
          }
          return dates
        })
      })

      // fills the dropdown selection form dynamically, based on the 'dates' array for more than one results
      if (dates.length > 0) {
        options = dates.map((date, k) => {
          return (
            <option key={k} data-id={k} value={date}>
              {date}
            </option>
          )
        })
        option = (
          <FormControl
            onChange={this.handleOption}
            onFocus={this.handleOption}
            onBlur={this.handleOption}
            className="form-control"
            componentClass="select"
            placeholder="Add NameDay"
            value={dates[value]}
          >
            {options}
          </FormControl>
        )
      } else {
        // fills the selection when the 'dates' array has only one result
        let selectedDate
        if (moment(newDate).year() !== now && newDate !== null) {
          selectedDate = moment(
            moment(newDate).format("DD/MM") + "/" + now,
            "DD/MM/YYYY"
          )
        } else if (newDate === null) {
          selectedDate = newDate
        } else {
          selectedDate = moment(newDate)
        }

        // activates the DatePicker if no date exists for an unlisted name
        option = datePickerComp(
          selectedDate,
          this.handleChange,
          this.handleOnBlur,
          now
        )
      }
    } else {
      // activates the DatePicker for the first time
      option = datePickerComp(
        newDate,
        this.handleChange,
        this.handleOnBlur,
        now
      )
    }
    return option
  }

  render() {
    return <div>{this.selectDate()}</div>
  }
}

export default Nameday
