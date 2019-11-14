import React, { Component } from "react"
import AppActions from "../actions/AppActions"
import AppStore from "../stores/AppStore"
import { ListGroupItem } from "react-bootstrap"
import Easter from "./Easter"
import moment from "moment"
import "react-datepicker/dist/react-datepicker.css"

const listItem = date => (
  <ListGroupItem>
    <img src="images/calendar.png" className="glyph" width="35px" alt="" />{" "}
    {date}{" "}
  </ListGroupItem>
)

class NamedayListGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      saints: AppStore.getNames(),
      easterSaints: AppStore.getEasterNames(),
      specialEasterSaints: AppStore.getSpecialEasterNames(),
      newDate: this.props.date,
      value: this.props.dateId,
    }
  }

  UNSAFE_componentWillMount() {
    AppStore.addChangeListener(this.onChange)
  }

  componentDidMount() {
    AppActions.getNames()
    AppActions.getEasterNames()
    AppActions.getSpecialEasterNames()
    this._isMounted = true
  }

  onChange = () => {
    if (this._isMounted) {
      this.setState({
        saints: AppStore.getNames(),
        easterSaints: AppStore.getEasterNames(),
        specialEasterSaints: AppStore.getSpecialEasterNames(),
      })
    }
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this.onChange)
    this._isMounted = false
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

  handleGroupItemParent = changedDate => {
    if (changedDate && !this._isMounted) {
      this.props.callbackNamedayParent(
        moment(changedDate, "DD/MM/YYYY"),
        this.props.dateId,
        this.props.parent,
        this.props.index
      )
    }
  }

  handleGroupItemChild = changedDate => {
    if (changedDate) {
      this.props.callbackNamedayChild(
        moment(changedDate, "DD/MM/YYYY"),
        this.props.dateId,
        this.props.parent,
        this.props.index
      )
    }
  }

  selectDate = () => {
    const { name, child } = this.props
    const {
      value,
      saints,
      easterSaints,
      specialEasterSaints,
      newDate,
    } = this.state
    let firstName = name // updates the first name of the parent or the parent connection
    let dates = []
    let easterDates = []
    let option
    let now = moment().get("year")

    // checks if there is a listed name (value == '10' --> name isn't listed )
    if (value !== "10") {
      // searches the 'recurring_namedays' json file
      saints.forEach((saint, i) => {
        saint.names.forEach((name, j) => {
          if (name === firstName) {
            dates.push(saint.date + "/" + now)
          }
          return dates
        })
        return null
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
        return null
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
        return null
      })

      // replaces the existing listed date with the correct one based on the current year results
      if (newDate !== "") {
        if (child === false) {
          this.handleGroupItemParent(dates[value])
          option = listItem(dates[value])
        } else {
          this.handleGroupItemChild(dates[value])
          option = listItem(dates[value])
        }
        // if there is no existing date, it takes no action
      } else {
        option = listItem(newDate)
      }

      // if there is NOT a listed name (value == '10' --> name isn't listed) replaces ONLY the year of the existing listed date with the current year
    } else {
      if (newDate !== "") {
        if (this.props.child === false) {
          this.handleGroupItemParent(
            moment(newDate).format("DD/MM") + "/" + now
          )
          option = listItem(moment(newDate).format("DD/MM") + "/" + now)
        } else {
          this.handleGroupItemChild(moment(newDate).format("DD/MM") + "/" + now)
          option = listItem(moment(newDate).format("DD/MM") + "/" + now)
        }
        // if there is no existing date, it takes no action
      } else {
        option = listItem(newDate)
      }
      return option
    }
  }

  render() {
    return <div>{this.selectDate()}</div>
  }
}

export default NamedayListGroup
