import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const projectDatabasePath = fileURLToPath(new URL('./project.db', import.meta.url))

function projectDatabasePlugin() {
  return {
    name: 'project-database',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://localhost').pathname
        if (!pathname.endsWith('/project.db')) return next()

        try {
          response.setHeader('Content-Type', 'application/octet-stream')
          response.setHeader('Cache-Control', 'no-store')
          response.end(readFileSync(projectDatabasePath))
        } catch (error) {
          next(error)
        }
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'project.db',
        source: readFileSync(projectDatabasePath),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), projectDatabasePlugin()],
  base: "/portfolio/"
})
