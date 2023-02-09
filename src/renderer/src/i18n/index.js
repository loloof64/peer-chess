import { createI18n } from 'vue-i18n'

import en from './en'
import es from './es'
import fr from './fr'
const messages = { en, es, fr }

const i18n = createI18n({
    legacy: false,
    locale: navigator.language,
    fallbackLocale: 'en',
    messages,
})

export default i18n;