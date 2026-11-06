import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function enquiryApiPlugin() {
  const dataDir = path.resolve(import.meta.dirname, './data')
  const dataFile = path.join(dataDir, 'enquiries.json')

  const readData = () => {
    try {
      if (!fs.existsSync(dataFile)) return []
      return JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    } catch {
      return []
    }
  }

  const writeData = (data) => {
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8')
    } catch (err) {
      console.error('Failed to write enquiries data:', err)
    }
  }

  return {
    name: 'enquiry-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/enquiries') {
          if (req.method === 'GET') {
            const list = readData()
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ enquiries: list }))
            return
          }
          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk) => {
              body += chunk
            })
            req.on('end', () => {
              try {
                const record = JSON.parse(body)
                const list = readData()
                list.unshift(record)
                writeData(list)
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, record }))
              } catch {
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'Invalid JSON' }))
              }
            })
            return
          }
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), enquiryApiPlugin()],
  resolve: {
    // The shadcn convention. Components dropped into src/components/ui expect
    // to import '@/lib/utils', so the alias has to exist before they will
    // resolve at all.
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
})
