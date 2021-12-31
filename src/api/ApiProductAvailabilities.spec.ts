// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import { ApiProductAvailabilities } from './ApiProductAvailabilities'

describe('MyClass', () => {
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
    expect(apiProductAvailabilities.getHash()).toBe(
      '2021-11-25T00:00:00.000Z-2021-11-24T17:00:00.000Z-0-10-false-2021-11-25T14:00:00.000Z-0-12-false-2021-11-25T18:00:00.000Z-1-10-true'
    )
  })
})
