// formats birthday to DD/MM/YYYY
export const birthdayFormat = date => {
  let newBirthday
  typeof date === "object"
    ? (newBirthday =
        date
          .format()
          .toString()
          .slice(8, 10) +
        "/" +
        date
          .format()
          .toString()
          .slice(5, 7) +
        "/" +
        date
          .format()
          .toString()
          .slice(0, 4))
    : (newBirthday = date)
  return newBirthday
}
