import React from "react"
import ParentListItem from "./ParentListItem"

const Parents = ({ parents }) => (
  <div>
    {(parents || []).map(parent => {
      return <ParentListItem key={parent.id} parent={parent} />
    })}
  </div>
)

export default Parents
