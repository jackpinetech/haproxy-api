const HAProxy = require('haproxy-sdk');

/**
 * GET /backends
 * List all backends
 */
exports.get = (req, res) => {
  res.locals.haproxy.backends()
    .then(backends => res.json(backends))
    .catch(reason => res.status(400).send(reason));
};

/**
 * GET /backends/:name
 * Show backend
 */
exports.getBackend = (req, res) => {
  res.locals.haproxy.backend(req.params.name)
    .then(backend => {
      Promise.all([
        backend.processNumber()
        , backend.requests()
        , backend.status()
      ])
        .then(results => {
          return res.json({
            iid: backend.iid
            , name: backend.name
            , processNumber: results[0]
            , requests: results[1]
            , status: results[2]
            , metrics: HAProxy.BACKEND_METRICS
          });
        });
    }).catch(reason => res.status(400).send(reason));
};

/**
 * GET /backends/:name/:metric
 * Show backend
 */
exports.getBackendMetric = (req, res) => {
  res.locals.haproxy.backend(req.params.name)
    .then(backend => backend.metric(req.params.metric))
    .then(results => res.json(results))
    .catch(reason => res.status(400).send(reason));
};

/**
 * GET /backends/:name/servers
 * Show all backend servers
 */
exports.getBackendServers = (req, res) => {
  res.locals.haproxy.backend(req.params.name)
    .then(backend => backend.servers())
    .then(servers => res.json(servers.map(server => {
        return {
          sid: server.sid
          , name: server.name
        };
      }))
    )
    .catch(reason => res.status(400).send(reason));
};
