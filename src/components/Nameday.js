import React, { Component } from "react"
import AppActions from "../actions/AppActions"
import AppStore from "../stores/AppStore"
import { FormControl } from "react-bootstrap"
import DatePicker from "react-datepicker"
import Easter from "./Easter"
import moment from "moment"
import "react-datepicker/dist/react-datepicker.css"

const datePickerFunc = (date, handleChange, handleOnBlur, now) => (
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

// async function searchNames(name = "") {
//   fetch("https://namedays.vassog.now.sh/api/nameday?name=" + name, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then(response => {
//       if (response.status !== 200) {
//         console.log(
//           "Looks like there was a problem. Status Code: " + response.status
//         )
//         return
//       }

//       // Examine the text in the response
//       // response.json().then(names => {
//       //   console.log(names)
//       // })
//       console.log("success!")
//     })
//     .catch(err => {
//       console.log("Fetch Error :-S", err)
//     })
//   return
// }

async function searchNames(name = "") {
  const proxyurl = "https://cors-anywhere.herokuapp.com/"
  let response = await fetch(
    proxyurl + `https://namedays.vassog.now.sh/api/nameday?name=` + name
  )
  let names = await response.json()
  return names
}

// getUserAsync("yourUsernameHere").then(data => console.log(data))

// searchNames("https://example.com/answer", { answer: 42 }).then(data => {
//   console.log(data) // JSON data parsed by `response.json()` call
// })

class Nameday extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value || new Date(),.. || props.value < now 
      saints: [],
      easterSaints: [],
      specialEasterSaints: [],
      newDate: this.props.date,
      value: this.props.dateId,
      onList: this.props.onList,
      options: [new Date().toISOString()],
    }
  }

  UNSAFE_componentWillMount() {
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
      this.props.callbackNameday(
        moment(e.target.value, "DD/MM/YYYY").toISOString(),
        id
      )
    } else {
      this.props.callbackNameday("", "10")
    }
  }

  handleOnBlur = evt => {
    let now = moment().get("year")
    let v = evt.target.value
    if (v !== "") {
      searchNames(v).then(names => {
        const dates = names.list.map((name, i) => {
          return name.day + "/" + name.month + "/" + now
        })
        this.setState(s => ({ ...s, options: s.options.concat(dates) }))
      })
    }
  }

  // handler to control date change of DatePicker
  handleChange = selected => {
    this.setState({ newDate: selected })
    this.props.callbackNameday(selected, "10")
  }

  // aaa = searchNames("Βάσω").then(res =>
  //   console.log(res).catch(err => console.log(err))
  // )
  // aaa = searchNames("Μαρία").then(names => console.log(names))

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
    // if (firstName !== "") {
    //   searchNames(firstName).then(names => forEach((name, i) => {
    //     dates.push(name.day+name.month+now)
    //   }))
    // }
    // if (firstName !== "") {
    //   searchNames(firstName).then(names =>
    //     names.list.forEach((name, i) => {
    //       dates.push(name.day + "/" + name.month + "/" + now)
    //     })
    //   )
    // }
    if (firstName !== "") {
      searchNames(firstName).then(names =>
        names.list.forEach((name, i) => {
          dates.push(name.day + "/" + name.month + "/" + now)
        })
      )
      console.log({ dates })
      // // searches the 'recurring_namedays' json file
      // saints.forEach((saint, i) => {
      //   saint.names.forEach((name, j) => {
      //     if (name === firstName) {
      //       dates.push(saint.date + "/" + now)
      //     }
      //     return dates
      //   })
      // })
      // // searches the 'relative_to_easter' json file
      // easterSaints.forEach((easterSaint, l) => {
      //   easterSaint.variations.forEach((easterName, m) => {
      //     if (easterName === firstName) {
      //       easterDates.push(easterSaint.toEaster)
      //       dates.push(
      //         moment(Easter(now).props.children)
      //           .add(easterDates[0], "day")
      //           .format("DD/MM/YYYY")
      //       )
      //     }
      //     return dates
      //   })
      // })
      // // searches the 'recurring_special_namedays' json file
      // specialEasterSaints.forEach((saint, i) => {
      //   saint.names.forEach((name, j) => {
      //     if (name === firstName) {
      //       var special_saint = moment([
      //         moment().get("year"),
      //         0,
      //         parseInt(saint.date.slice(0, 2), 10),
      //       ])
      //       var easter = moment([
      //         moment().get("year"),
      //         0,
      //         parseInt(
      //           moment(Easter(now).props.children)
      //             .format("DD/MM/YYYY")
      //             .slice(0, 2),
      //           10
      //         ),
      //       ])
      //       if (easter.diff(special_saint, "days") >= 0) {
      //         easterDates.push(saint.toEaster)
      //         dates.push(
      //           moment(Easter(now).props.children)
      //             .add(easterDates[0], "day")
      //             .format("DD/MM/YYYY")
      //         )
      //       } else {
      //         dates.push(saint.date + "/" + now)
      //       }
      //     }
      //     return dates
      //   })
      // })

      // fills the dropdown selection form dynamically, based on the 'dates' array for more than one results
      if (dates.length > 0) {
        options = dates.map((date, k) => (
          <option key={k} data-id={k} value={date}>
            {date}
          </option>
        ))
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
            <option key={10} data-id={10} value={""}>
              {""}
            </option>
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
          ).toISOString()
        } else if (newDate === null) {
          selectedDate = ""
        } else {
          selectedDate = moment(newDate).toISOString()
        }
        // activates the DatePicker if no date exists for an unlisted name
        option = datePickerFunc(
          selectedDate,
          this.handleChange,
          this.handleOnBlur,
          now
        )
      }
    } else {
      // activates the DatePicker for the first time
      option = datePickerFunc(
        newDate,
        this.handleChange,
        this.handleOnBlur,
        now
      )
    }
    return option
  }

  render() {
    let options = this.state.options
    return (
      <div>
        <FormControl
          onChange={this.handleOption}
          onFocus={this.handleOption}
          onBlur={this.handleOnBlur}
          className="form-control"
          componentClass="select"
          placeholder="Add NameDay"
          value={options[value]}
        >
          {/* <option key={10} data-id={10} value={""}>
              {""}
            </option> */}
          {options.map((date, k) => (
            <option key={k} data-id={k} value={date}>
              {date}
            </option>
          ))}
        </FormControl>
      </div>
    )
  }
}

export default Nameday
