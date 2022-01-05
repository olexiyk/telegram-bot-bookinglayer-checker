import { zonedTimeToUtc } from 'date-fns-tz'
import env from '@/helpers/env'

export interface JsonProductAvailability {
  data: {
    first_available: string
    dates: { [date: string]: JsonProductAvailabilitySlot }
  }
}

interface JsonProductAvailabilitySlot {
  availability: number
  capacity: number
  available_for_checkin: boolean
  timeslots?: { [dateTime: string]: JsonProductAvailabilitySlot }
}

export class Timeslot {
  public dateTime: Date
  public availability: number
  public capacity: number
  public availableForCheckin: boolean

  constructor(dateTime: string, timeslotData: JsonProductAvailabilitySlot) {
    this.dateTime = zonedTimeToUtc(dateTime, env.TIMEZONE)
    this.availability = timeslotData.availability
    this.capacity = timeslotData.capacity
    this.availableForCheckin = timeslotData.available_for_checkin
  }
}

export class Availability {
  public date: Date
  public availability: number
  public capacity: number
  public availableForCheckin: boolean
  public timeslots: Timeslot[]

  constructor(date: string, availabilityData: JsonProductAvailabilitySlot) {
    this.date = zonedTimeToUtc(date, env.TIMEZONE)
    this.availability = availabilityData.availability
    this.capacity = availabilityData.capacity
    this.availableForCheckin = availabilityData.available_for_checkin

    const timeslots: Timeslot[] = []
    for (const timeslot of Object.entries(availabilityData.timeslots || [])) {
      const [time, timeslotData] = timeslot
      timeslots.push(new Timeslot(date + ' ' + time, timeslotData))
    }

    this.timeslots = timeslots
  }
}

export class ApiProductAvailabilities {
  public firstAvailableDate: Date
  public availabilities: Availability[]

  constructor(jsonData: JsonProductAvailability) {
    const data = jsonData.data
    this.firstAvailableDate = zonedTimeToUtc(data.first_available, env.TIMEZONE)

    const availabilities: Availability[] = []
    for (const dates of Object.entries(data.dates)) {
      const [date, availabilityData] = dates

      availabilities.push(new Availability(date, availabilityData))
    }
    this.availabilities = availabilities
  }

  public getFingerprint(): string {
    return (
      this.firstAvailableDate.getTime() +
      '-' +
      this.availabilities
        .map((availability) =>
          availability.timeslots
            .map(
              (timeslot) =>
                timeslot.dateTime.getTime() +
                '-' +
                timeslot.availability +
                '-' +
                timeslot.capacity +
                '-' +
                timeslot.availableForCheckin
            )
            .join('-')
        )
        .join('-')
    )
  }
}
