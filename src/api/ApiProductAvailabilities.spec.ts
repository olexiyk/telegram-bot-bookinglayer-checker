import { ApiProductAvailabilities } from '@/api/ApiProductAvailabilities'

describe('ApiProductAvailabilities', () => {
  it('should have a name property when instantiated', () => {
    const data = {
      data: {
        first_available: '2021-11-25',
        dates: {
          '2021-11-24': {
            availability: 0,
            capacity: 10,
            available_for_checkin: false,
            timeslots: {
              '18:00': {
                availability: 0,
                capacity: 10,
                available_for_checkin: false,
              },
            },
          },
          '2021-11-25': {
            availability: 1,
            capacity: 10,
            available_for_checkin: true,
            timeslots: {
              '15:00': {
                availability: 0,
                capacity: 12,
                available_for_checkin: false,
              },
              '19:00': {
                availability: 1,
                capacity: 10,
                available_for_checkin: true,
              },
            },
          },
        },
      },
    }
    const apiProductAvailabilities = new ApiProductAvailabilities(data)
    expect(apiProductAvailabilities.getFingerprint()).toBe(
      '1637794800000-1637773200000-0-10-false-1637848800000-0-12-false-1637863200000-1-10-true'
    )
  })
})
