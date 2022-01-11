import { localisedServerTimezone } from '@/helpers/i18n'

describe('i18n', () => {
  it('localises timezone', () => {
    expect(localisedServerTimezone('en')).toBe('Central European Standard Time')
    expect(localisedServerTimezone('uk')).toBe(
      'за центральноєвропейським стандартним часом'
    )
    expect(localisedServerTimezone('de')).toBe('Mitteleuropäische Normalzeit')
    expect(localisedServerTimezone('ru')).toBe(
      'Центральная Европа, стандартное время'
    )
    expect(localisedServerTimezone('ko')).toBe('중부유럽 표준시')
  })
})
