import React, { Component } from "react"
import ParentListItem from "./ParentListItem"
import AppActions from "../actions/AppActions"
import AppStore from "../stores/AppStore"

// FIXME: remove AppActions from ComponentDidMount
class Parents extends Component {
  constructor(props) {
    super(props)
    this.state = {
      parents: [],
    }
  }

  componentWillMount() {
    AppStore.addChangeListener(this.onChange)
  }

  componentDidMount() {
    AppActions.getParents()
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this.onChange)
  }

  onChange = () => this.setState({ parents: AppStore.getParents() })

  render() {
    let parentListItems

    if (this.state.parents) {
      parentListItems = this.state.parents.map(parent => {
        return <ParentListItem key={parent._id.$oid} parent={parent} />
      })
    }
    return <div>{parentListItems}</div>
  }
}

export default Parents
