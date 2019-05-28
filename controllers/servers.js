const HAProxy = require('haproxy-sdk');

/**
 * DELETE /servers/:name
 * Shutdown a server
 */
exports.deleteServer = (req, res) => {
  res.locals.haproxy.server(req.params.name)
    .then(servers => Promise.all(servers.map(server => server.shutdown()))
    .then(() => res.status(204).end()))
    .catch(reason => res.status(400).send(reason));
};

/**
 * GET /servers
 * List all servers
 */
exports.get = (req, res) => {
  res.locals.haproxy.servers()
    .then(servers => res.json(servers))
    .catch(reason => res.status(400).send(reason));
};

/**
 * GET /servers/:name
 * Show server
 */
exports.getServer = (req, res) => {
  res.locals.haproxy.server(req.params.name)
    .then(servers => {
      return Promise.all(servers.map(server => _getServer(server)));
    })
    .then(servers => {
      return {
        sid: servers[0]['sid']
        , name: servers[0]['name']
        , backends: servers.map(_server => {
            return {
              processNumber: _server['processNumber']
              , requests: _server['requests']
              , status: servers[0]['status']
              , weight: _server['weight']
              , checkCode: servers[0]['checkCode']
              , checkStatus: servers[0]['checkStatus']
            };
          })
        , address: servers[0]['address']
        , port: servers[0]['port']
        , metrics: servers[0]['metrics']
      };
    })
    .then(server => res.json(server))
    .catch(reason => res.status(400).send(reason));
};

/**
 * GET /servers/:name/:metric
 * Show server metric
 */
exports.getServerMetric = (req, res) => {
  res.locals.haproxy.server(req.params.name)
    .then(servers => Promise.all(servers.map(server => server.metric(req.params.metric).then(result =>{return {[server.backendName]: result};})
    )))
    .then(results => res.json(results))
    .catch(reason => res.status(400).send(reason));
};

/**
 * PATCH /servers/:name
 * Update server
 */
exports.patchServer = (req, res) => {
  if (!req.body) {
    res.status(400).send('invalid options');
    return;
  }
  res.locals.haproxy.server(req.params.name)
    .then(servers => Promise.all(servers.map(server => _patchServer(server, req.body))))
    .then(() => res.status(204).end())
    .catch(reason => res.status(400).send(reason));
};

_patchServer = (server, options) => {
  let promises = [];
  if (options['weight']) {
    promises.push(server.setWeight(options['weight']));
  }
  if (options['address']) {
    promises.push(server.setAddress(options['address']));
  }
  if (options['port']) {
    promises.push(server.setPort(options['port']));
  }
  if (options['status']) {
    promises.push(server.setState(_getServerState(options['status'])));
  }
  return Promise.all(promises);
}

_getServerState = state => {
  switch (state) {
    case 'up':
      return HAProxy.SERVER_ENABLE;
    case 'down':
      return HAProxy.SERVER_DISABLE;
    case 'ready':
      return HAProxy.SERVER_READY;
    case 'offline':
      return HAProxy.SERVER_MAINT;
    case 'drain':
      return HAProxy.SERVER_DRAIN;
    default:
      throw 'invalid state';
  }
}

_getServer = (server) => {
  return Promise.all([
    server.processNumber()
    , server.requests()
    , server.status()
    , server.weight()
    , server.address()
    , server.port()
    , server.checkCode()
    , server.checkStatus()
  ]).then(results => {
    return {
      sid: server.sid
      , name: server.name
      , processNumber: results[0]
      , requests: results[1]
      , status: results[2]
      , weight: results[3]
      , address: results[4]
      , port: results[5]
      , checkCode: results[6]
      , checkStatus: results[7]
      , metrics: HAProxy.SERVER_METRICS
    }
  })
};
