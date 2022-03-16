import React from "react"
import { collection, query, getDocs } from "firebase/firestore"
import { Parent } from "models/parent"
import { db } from "firebase/config"
import ParentListItem from "./ParentListItem"

const Parents = () => {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [parents, setParents] = React.useState<Parent[]>([])

  const q = query(collection(db, "contacts"))

  const querySnapshot = getDocs(q)

  React.useEffect(() => {
    querySnapshot.then((qs) => {
      let contacts: any[] = []
      qs.forEach((doc) => contacts.push({ ...doc.data() }))
      setParents(() => contacts)
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  return loading ? (
    <h1>loading firebase data...</h1>
  ) : (
    <>
      {parents?.map((parent, idx) => (
        <ParentListItem key={idx} parent={parent} />
      ))}
    </>
  )
}

export default Parents
