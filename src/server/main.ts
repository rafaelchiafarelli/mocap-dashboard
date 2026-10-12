import { createApp } from './app.js'

const host = '127.0.0.1'
const port = Number(process.env.PORT ?? 4174)
const app = createApp()

try {
  await app.listen({ host, port })
} catch (error) {
  app.log.error(error)
  process.exitCode = 1
}
