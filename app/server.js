import Hapi from 'hapi'

const server = Hapi.server({
  port: 3000
})

const healthyRoute = (await import('./routes/healthy.js')).default
const healthzRoute = (await import('./routes/healthz.js')).default

const routes = [healthyRoute, healthzRoute]

server.route(routes)

export { server }