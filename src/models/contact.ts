export interface Common {
  id?: string
  firstName?: string
  lastName?: string
  phone?: string
  mobile?: string
  email?: string | null
  birthday?: string
  avatarUrl?: string
  nameday?: {
    nameday_id: string
    date: string
  }
}

export interface Contact extends Common {
  id: string
  firstName: string
  lastName?: string
  photoURL?: string | null
  phoneNumber?: string | null
  connections?: Common[]
}
