import fastifyStatic from '@fastify/static'
import Fastify, { type FastifyInstance, type FastifyRequest } from 'fastify'
import { randomBytes, timingSafeEqual } from 'node:crypto'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'
import { ProjectScanError, scanProject } from './project-inventory.js'

const projectRequestSchema = z.object({
  path: z.string().trim().min(1).max(4096),
})

const allowedLocalHosts = new Set([
  'localhost:4174',
  '127.0.0.1:4174',
  '[::1]:4174',
  'localhost:5173',
  '127.0.0.1:5173',
  '[::1]:5173',
])
const allowedLocalOrigins = new Set([
  'http://localhost:4174',
  'http://127.0.0.1:4174',
  'http://[::1]:4174',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://[::1]:5173',
])

function isTrustedLocalRequest(request: FastifyRequest): boolean {
  const host = request.headers.host
  if (typeof host !== 'string' || !allowedLocalHosts.has(host.toLowerCase())) return false

  const origin = request.headers.origin
  if (origin === undefined) return true
  return typeof origin === 'string' && allowedLocalOrigins.has(origin)
}

function tokenMatches(received: string | undefined, expected: string): boolean {
  if (received === undefined || received.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(received), Buffer.from(expected))
}

export interface AppOptions {
  sessionToken?: string
  serveFrontend?: boolean
  logger?: boolean
}

export function createApp(options: AppOptions = {}): FastifyInstance {
  const app = Fastify({ logger: options.logger ?? true, bodyLimit: 16 * 1024 })
  const sessionToken = options.sessionToken ?? randomBytes(32).toString('hex')

  app.addHook('onRequest', async (request, reply) => {
    if (!request.url.startsWith('/api/')) return
    if (!isTrustedLocalRequest(request)) {
      await reply.code(403).send({ error: 'Requests must come from the local dashboard origin.' })
    }
  })

  app.get('/api/session', async (_request, reply) => {
    reply.header('cache-control', 'no-store')
    return { token: sessionToken }
  })

  app.post('/api/project/inspect', async (request, reply) => {
    const suppliedToken = request.headers['x-workflow-token']
    if (!tokenMatches(typeof suppliedToken === 'string' ? suppliedToken : undefined, sessionToken)) {
      return reply.code(403).send({ error: 'Dashboard session token is missing or invalid.' })
    }

    const parsedBody = projectRequestSchema.safeParse(request.body)
    if (!parsedBody.success) {
      return reply.code(400).send({ error: 'Provide a project folder path (up to 4096 characters).' })
    }

    try {
      return await scanProject(parsedBody.data.path)
    } catch (error) {
      if (error instanceof ProjectScanError) {
        return reply.code(400).send({ error: error.message })
      }
      throw error
    }
  })

  if (options.serveFrontend ?? true) {
    const distPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../dist')
    if (existsSync(resolve(distPath, 'index.html'))) {
      void app.register(fastifyStatic, { root: distPath })
      app.setNotFoundHandler((request, reply) => {
        if (request.url.startsWith('/api/')) {
          return reply.code(404).send({ error: 'API route not found.' })
        }
        return reply.sendFile('index.html')
      })
    }
  }

  return app
}
