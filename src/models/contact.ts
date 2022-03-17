interface Common {
  id?: string
  firstName?: string
  lastName?: string
  phone?: string
  mobile?: string
  email?: string
  birthday?: string
  nameday?: {
    nameday_id: string
    date: string
  }
}

export interface Contact extends Common {
  connections?: Common[]
}
