import { I18n, pluralize } from '@grammyjs/i18n'
import { cwd } from 'process'
import { resolve } from 'path'
import env from '@/helpers/env'

const i18n = new I18n({
  defaultLanguageOnMissing: true,
  directory: resolve(cwd(), 'locales'),
  defaultLanguage: 'en',
  templateData: {
    pluralize,
    lowercase: (value: string) => value.toLowerCase(),
  },
})

export default i18n

export function localisedServerTimezone(locale: string): string {
  return new Date()
    .toLocaleDateString(locale, {
      timeZone: env.TIMEZONE,
      timeZoneName: 'long',
    })
    .replace(new Date().toLocaleDateString(locale), '')
    .replace(/^,?\s/g, '')
}
