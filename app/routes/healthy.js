export default {
  method: 'GET',
  path: '/healthy',
  handler: (request, h) => {
    return h.response('ok').code(200);
  }
}