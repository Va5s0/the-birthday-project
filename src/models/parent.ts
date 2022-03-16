interface Common {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  birthday: Date
  nameday: {
    nameday_id: string
    date: Date
  }
}

export interface Parent extends Common {
  connections: Common[]
}
