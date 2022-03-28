export const getFullYearDate = (day?: string, month?: string) =>
  new Date(`${month}/${day}/${new Date().getFullYear()}` || "")

export const dateFormatter = (date?: string) =>
  new Date(date || "").toLocaleDateString("en-GB")

export const easter = () => {
  const E = new Date().getFullYear()
  const a = E % 19 //a = position of the year in the 19 year cycle (0-18)
  const T = (8 + 11 * a) % 30 // Julian Epact
  let month = 3 //Sets the month to March
  const K = Math.floor(E / 100 - E / 400 - 2) //Calculates K

  const iPanArx = 21 + ((53 - T) % 30) //Calculates the Julian Full-Moon
  let iPanArxM
  if (iPanArx > 31) {
    //if the number is bigger the total of days in March, it is converted to respective day in April
    iPanArxM = iPanArx - 31
    month = 4 //and the month is set to April
  } else {
    iPanArxM = iPanArx
  } //else it remains the same but it is assigned to another variable

  let iPas
  const iPanTel = iPanArxM + K //calculates the iPanTel, not sure what it is...
  const Y = (E + Math.floor(E / 4) + iPanArx) % 7 //calculates the position Y of iPanTel in the week days (0-Sunday,1-Monday κτλ)
  iPas = iPanTel + (7 - Y) //calculates the Orthodox Easter date
  if (iPas > 30 && month === 4) {
    //if number of April days > 30, they are converted to May days.
    month = 5 // and month is set to May
    iPas = iPas - 30
  } else if (iPas > 31 && month === 4) {
    //else if number of March days > 31, they are converted to April days.
    month = 4 // and month is to April
    iPas = iPas - 31
  }
  if (E > 2099) {
    iPas++
  } else if (E < 2000) {
    iPas++
  } //corrects an error for dates bigger than 2099

  return getFullYearDate(iPas.toString(), month.toString())
}
