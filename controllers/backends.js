const HAProxy = require("haproxy-sdk");

/**
 * GET /backends
 * List all backends
 */
exports.get = (req, res) => {
  res.locals.haproxy
    .backends()
    .then((backends) => res.json(backends))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /backends/:name
 * Show backend
 */
exports.getBackend = (req, res) => {
  res.locals.haproxy
    .backend(req.params.name)
    .then((backend) => {
      Promise.all([
        backend.processNumber(),
        backend.requests(),
        backend.status(),
      ]).then((results) => {
        return res.json({
          iid: backend.iid,
          name: backend.name,
          processNumber: results[0],
          requests: results[1],
          status: results[2],
          metrics: HAProxy.BACKEND_METRICS,
        });
      });
    })
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /backends/:name/:metric
 * Show backend
 */
exports.getBackendMetric = (req, res) => {
  res.locals.haproxy
    .backend(req.params.name)
    .then((backend) => backend.metric(req.params.metric))
    .then((results) => res.json(results))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /backends/:name/servers
 * Show all backend servers
 */
exports.getBackendServers = (req, res) => {
  res.locals.haproxy
    .backend(req.params.name)
    .then((backend) => backend.servers())
    .then((servers) =>
      res.json(
        servers.map((server) => {
          return {
            sid: server.sid,
            name: server.name,
          };
        })
      )
    )
    .catch((reason) => res.status(400).send(reason));
};

/**
 * POST /backends/:name/servers
 * "Create" server. This command will find the first available server
 * in MAINT mode, update its weight/address/port, and (optionally) set
 * the status.
 */
exports.postBackendServer = (req, res) => {
  if (!req.body) {
    res.status(400).send("invalid options");
    return;
  }
  res.locals.haproxy
    .backend(req.params.name)
    .then((backend) => backend.servers())
    .then((servers) => _getServerInState(servers, "MAINT"))
    .then(async (server) => {
      if (req.body["weight"]) {
        await server.setWeight(req.body["weight"]);
      }
      if (req.body["address"]) {
        await server.setAddress(req.body["address"]);
      }
      if (req.body["port"]) {
        await server.setPort(req.body["port"]);
      }
      if (req.body["status"]) {
        await server.setState(_getServerState(req.body["status"]));
      }
      return server;
    })
    .then((server) => res.json(server.sid))
    .catch((reason) => {
      console.log(reason);
      res.status(400).send(reason);
    });
};

let _getServersStatus = (servers) => {
  return Promise.all(servers.map((server) => server.status()));
};

let _getServerInState = async (servers, state, limit = 10) => {
  let chunks = servers.reduce(function (accumulator, currentValue) {
    let last = accumulator.pop();
    if (!last) accumulator.push([].concat(currentValue));
    else if (last.length == limit) {
      accumulator.push(last);
      accumulator.push([].concat(currentValue));
    } else accumulator.push(last.concat(currentValue));
    return accumulator;
  }, []);
  for (let i = 0; i < chunks.length; i++) {
    let statii = await _getServersStatus(chunks[i]);
    if (statii.some((status) => status == state)) {
      return chunks[i][statii.findIndex((status) => status == state)];
    }
  }
  throw "Found no servers in state " + state;
};

let _getServerState = (state) => {
  switch (state) {
    case "up":
      return HAProxy.SERVER_ENABLE;
    case "down":
      return HAProxy.SERVER_DISABLE;
    case "ready":
      return HAProxy.SERVER_READY;
    case "offline":
      return HAProxy.SERVER_MAINT;
    case "drain":
      return HAProxy.SERVER_DRAIN;
    default:
      throw "invalid state";
  }
};
