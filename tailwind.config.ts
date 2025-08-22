import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/infra/mail/templates/**/*.tsx'],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
