import moment from 'moment-timezone'

const getDateString = (date, format = 'MMM DD YYYY hh:mm:ss a') =>
  moment(date)
    .tz('America/Los_Angeles')
    .format(format)

export default getDateString
