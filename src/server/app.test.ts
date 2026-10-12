import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp } from './app.js'

const roots: string[] = []
const apps: Awaited<ReturnType<typeof createApp>>[] = []

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()))
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })))
})

describe('local dashboard API', () => {
  it('inventories a selected project only with the local session token', async () => {
    const root = await mkdtemp(join(tmpdir(), 'mocap-dashboard-api-'))
    roots.push(root)
    await writeFile(join(root, 'creative-brief.md'), '# Brief\n')
    const app = createApp({ sessionToken: 'test-session-token', serveFrontend: false, logger: false })
    apps.push(app)

    const response = await app.inject({
      method: 'POST',
      url: '/api/project/inspect',
      headers: {
        host: '127.0.0.1:4174',
        origin: 'http://127.0.0.1:4174',
        'x-workflow-token': 'test-session-token',
      },
      payload: { path: root },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({
      title: root.split('/').at(-1),
      documents: [{ path: 'creative-brief.md', category: 'Brief/direction' }],
    })
  })

  it('rejects non-local origins before handling project requests', async () => {
    const app = createApp({ sessionToken: 'test-session-token', serveFrontend: false, logger: false })
    apps.push(app)

    const response = await app.inject({
      method: 'GET',
      url: '/api/session',
      headers: {
        host: '127.0.0.1:4174',
        origin: 'https://untrusted.example',
      },
    })

    expect(response.statusCode).toBe(403)
  })
})
