const HAProxy = require("haproxy-sdk");

/**
 * DELETE /haproxy/all
 * Clear all statistics counters in each proxy
 */
exports.deleteAll = (req, res) => {
  res.locals.haproxy
    .clearCounters(true)
    .then(() => res.end())
    .catch((reason) => res.status(400).send(reason));
};

/**
 * DELETE /haproxy/counters
 * Clear the max values of the statistics counters.
 */
exports.deleteCounters = (req, res) => {
  res.locals.haproxy
    .clearCounters()
    .then(() => res.end())
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /haproxy/description
 * Show description of HAProxy.
 */
exports.getDescription = (req, res) => {
  res.locals.haproxy
    .description()
    .then((description) => res.json(description))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /haproxy/errors
 * Dump last known request and response errors
 */
exports.getErrors = (req, res) => {
  res.locals.haproxy
    .errors()
    .then((errors) => res.json(errors))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /haproxy/info
 * Show haproxy stats
 */
exports.getInfo = (req, res) => {
  res.locals.haproxy
    .info()
    .then((info) => res.json(info))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /haproxy/maxconn
 * Show the sum of configured maximum connections
 */
exports.getMaxconn = (req, res) => {
  res.locals.haproxy
    .maxConn()
    .then((maxConn) => res.json(maxConn))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /haproxy/metrics/:name
 * Return the value of a metric
 */
exports.getMetric = (req, res) => {
  res.locals.haproxy
    .metric(req.params.name)
    .then((metric) => res.json(metric))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /haproxy/metrics
 * Return all metrics
 */
exports.getMetrics = (req, res) => {
  res.json(HAProxy.HAPROXY_METRICS);
};

/**
 * GET /haproxy/node
 * Show nodename of HAProxy
 */
exports.getNodeName = (req, res) => {
  res.locals.haproxy
    .nodeName()
    .then((nodeName) => res.json(nodeName))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /haproxy/pids
 * Show PIDs of HAProxy processes
 */
exports.getPids = (req, res) => {
  res.locals.haproxy
    .processIds()
    .then((pids) => res.json(pids))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /haproxy/rate-limits
 * Show the process-wide rate limits
 */
exports.getRateLimits = (req, res) => {
  Promise.all([
    res.locals.haproxy.rateLimitConn(),
    res.locals.haproxy.rateLimitSess(),
    res.locals.haproxy.rateLimitSSLSess(),
  ])
    .then((rateLimits) =>
      res.json({
        connections: rateLimits[0],
        sessions: rateLimits[1],
        sslSessions: rateLimits[2],
      })
    )
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /haproxy/release-date
 * Show release date
 */
exports.getReleaseDate = (req, res) => {
  res.locals.haproxy
    .releaseDate()
    .then((releaseDate) => res.json(releaseDate))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /haproxy/requests
 * Show total requests processed by all frontends
 */
exports.getRequests = (req, res) => {
  res.locals.haproxy
    .requests()
    .then((requests) => res.json(requests))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /haproxy/uptime
 * Show uptime of HAProxy process
 */
exports.getUptime = (req, res) => {
  res.locals.haproxy
    .uptime()
    .then((uptime) => res.json(uptime))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /haproxy/version
 * Show version of HAProxy
 */
exports.getVersion = (req, res) => {
  res.locals.haproxy
    .version()
    .then((version) => res.json(version))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * PATCH /haproxy/maxconn
 * Update the global maximum connection limit
 */
exports.patchMaxconn = (req, res) => {
  let promises = [];
  if (req.body["maxconn"]) {
    promises.push(res.locals.haproxy.setMaxConn(req.body["maxconn"]));
  }
  Promise.all(promises)
    .then(() => res.status(204).end())
    .catch((reason) => res.status(400).send(reason));
};

/**
 * PATCH /haproxy/rate-limits
 * Update process-wide rate limits
 */
exports.patchRateLimits = (req, res) => {
  let promises = [];
  if (req.body["connections"]) {
    promises.push(res.locals.haproxy.setRateLimitConn(req.body["connections"]));
  }
  if (req.body["sessions"]) {
    promises.push(res.locals.haproxy.setRateLimitSession(req.body["sessions"]));
  }
  if (req.body["sslSessions"]) {
    promises.push(
      res.locals.haproxy.setRateLimitSSLSession(req.body["sslSessions"])
    );
  }
  Promise.all(promises)
    .then(() => res.status(204).end())
    .catch((reason) => res.status(400).send(reason));
};
