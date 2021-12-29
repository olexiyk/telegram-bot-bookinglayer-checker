export class Timeslot {
  public time: string
  public availability: number
  public capacity: number
  public availableForCheckin: boolean
  constructor(time: string, timeslotData: any) {
    this.time = time
    this.availability = timeslotData.availability
    this.capacity = timeslotData.capacity
    this.availableForCheckin = timeslotData.available_for_checkin
  }
}

export class Availability {
  public date: string
  public availability: number
  public capacity: number
  public availableForCheckin: boolean
  public timeslots: Timeslot[]
  constructor(date: string, availabilityData: any) {
    this.date = date
    this.availability = availabilityData.availability
    this.capacity = availabilityData.capacity
    this.availableForCheckin = availabilityData.available_for_checkin

    const timeslots: Timeslot[] = []
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    for (const timeslot of Object.entries(availabilityData.timeslots)) {
      const [time, timeslotData] = timeslot
      timeslots.push(new Timeslot(time, timeslotData))
    }

    this.timeslots = timeslots
  }
}

export class ApiProductAvailabilities {
  public firstAvailable: string
  public availabilities: Availability[]

  constructor(jsonData: any) {
    const data = jsonData.data || {}
    this.firstAvailable = data.first_available

    const availabilities: Availability[] = []
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    for (const dates of Object.entries(data.dates)) {
      const [date, availabilityData] = dates
      console.log(date, availabilityData)

      availabilities.push(new Availability(date, availabilityData))
    }
    this.availabilities = availabilities
  }
}
