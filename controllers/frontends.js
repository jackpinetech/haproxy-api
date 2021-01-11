const HAProxy = require("haproxy-sdk");

/**
 * DELETE /frontends/:name
 * Shutdown a frontend
 */
exports.deleteFrontend = (req, res) => {
  res.locals.haproxy
    .frontend(req.params.name)
    .then((frontend) => frontend.shutdown())
    .then(res.status(204).end())
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /frontends
 * List all frontends
 */
exports.get = (req, res) => {
  res.locals.haproxy
    .frontends()
    .then((frontends) => res.json(frontends))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /frontends/:name
 * Show frontend
 */
exports.getFrontend = (req, res) => {
  res.locals.haproxy
    .frontend(req.params.name)
    .then((frontend) => {
      Promise.all([
        frontend.processNumber(),
        frontend.requests(),
        frontend.status(),
        frontend.maxConn(),
      ]).then((results) => {
        return res.json({
          iid: frontend.iid,
          name: frontend.name,
          processNumber: results[0],
          requests: results[1],
          status: results[2],
          maxconn: results[3],
          metrics: HAProxy.FRONTEND_METRICS,
        });
      });
    })
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /frontends/:name/:metric
 * Show frontend metric
 */
exports.getFrontendMetric = (req, res) => {
  res.locals.haproxy
    .frontend(req.params.name)
    .then((frontend) => frontend.metric(req.params.metric))
    .then((results) => res.json(results))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * PATCH /frontends/:name
 * Update frontend
 */
exports.patchFrontend = (req, res) => {
  res.locals.haproxy
    .frontend(req.params.name)
    .then((frontend) => {
      let promises = [];
      if (req.body["status"]) {
        switch (req.body["status"]) {
          case "up":
            promises.push(frontend.enable());
            break;
          case "down":
            promises.push(frontend.disable());
            break;
          default:
            throw "invalid status";
        }
      }
      if (req.body["maxconn"]) {
        promises.push(frontend.setMaxConn(req.body["maxconn"]));
      }
      return Promise.all(promises);
    })
    .then(() => res.status(204).end())
    .catch((reason) => res.status(400).send(reason));
};
