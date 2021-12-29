export class Timeslot {
  public dateTime: Date
  public availability: number
  public capacity: number
  public availableForCheckin: boolean
  constructor(dateTime: string, timeslotData: any) {
    this.dateTime = new Date(dateTime)
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
  constructor(date: string, availabilityData: any) {
    this.date = new Date(date)
    this.availability = availabilityData.availability
    this.capacity = availabilityData.capacity
    this.availableForCheckin = availabilityData.available_for_checkin

    const timeslots: Timeslot[] = []
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    for (const timeslot of Object.entries(availabilityData.timeslots)) {
      const [time, timeslotData] = timeslot
      timeslots.push(new Timeslot(date + ' ' + time, timeslotData))
    }

    this.timeslots = timeslots
  }
}

export class ApiProductAvailabilities {
  public firstAvailableDate: Date
  public availabilities: Availability[]

  constructor(jsonData: any) {
    const data = jsonData.data || {}
    this.firstAvailableDate = new Date(data.first_available)

    const availabilities: Availability[] = []
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    for (const dates of Object.entries(data.dates)) {
      const [date, availabilityData] = dates

      availabilities.push(new Availability(date, availabilityData))
    }
    this.availabilities = availabilities
  }
}
