import React from "react"
import ParentListItem from "./ParentListItem"

const Parents = ({ parents }) => {
  let parentListItems

  if (parents) {
    parentListItems = parents.map(parent => {
      return <ParentListItem key={parent._id.$oid} parent={parent} />
    })
  }
  return <div>{parentListItems}</div>
}

export default Parents
