/**
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const compression = require('compression');
const dotenv = require('dotenv');
const errorHandler = require('errorhandler');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy;
const HAProxy = require('haproxy-sdk');

/**
 * Controllers (route handlers).
 */
const backendsController = require('./controllers/backends');
const haproxyController = require('./controllers/haproxy');
const frontendsController = require('./controllers/frontends');
const serversController = require('./controllers/servers');
const aclsController = require('./controllers/acls');
const mapsController = require('./controllers/maps');
const tablesController = require('./controllers/tables');

/**
 * Create Express server.
 */
const app = express();

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env.example' });

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use(compression());
app.use(logger(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.disable('x-powered-by');

/**
 * Configure authentication
 */
app.use(passport.initialize({}));
passport.use(
  new HeaderAPIKeyStrategy(
    { header: 'Authorization', prefix: 'Api-Key ' },
    false,
    function( apikey, done ) {
      return done(null, apikey === process.env.API_KEY);
    }
  )
);
app.use((req, res, next) => {
  passport.authenticate('headerapikey', { session: false })(req, res, next);
});

/**
 * Add the haproxy object to every request
 */
app.use((req, res, next) => {
  try {
    res.locals.haproxy = new HAProxy(process.env.HAPROXY_SOCKET);
    next();
  } catch (e) {
    res.status(500).send(e);
  }
});

/**
 * Primary app routes.
 */
app.get('/haproxy/description', haproxyController.getDescription);
app.get('/haproxy/errors', haproxyController.getErrors);
app.get('/haproxy/info', haproxyController.getInfo);
app.get('/haproxy/maxconn', haproxyController.getMaxconn);
app.patch('/haproxy/maxconn', haproxyController.patchMaxconn);
app.get('/haproxy/metrics/:name', haproxyController.getMetric);
app.get('/haproxy/metrics', haproxyController.getMetrics);
app.get('/haproxy/node', haproxyController.getNodeName);
app.get('/haproxy/pids', haproxyController.getPids);
app.get('/haproxy/rate-limits', haproxyController.getRateLimits);
app.patch('/haproxy/rate-limits', haproxyController.patchRateLimits);
app.get('/haproxy/release-date', haproxyController.getReleaseDate);
app.get('/haproxy/requests', haproxyController.getRequests);
app.get('/haproxy/uptime', haproxyController.getUptime);
app.get('/haproxy/version', haproxyController.getVersion);
app.delete('/haproxy/all', haproxyController.deleteAll);
app.delete('/haproxy/counters', haproxyController.deleteCounters);

app.get('/frontends', frontendsController.get);
app.get('/frontends/:name', frontendsController.getFrontend);
app.delete('/frontends/:name', frontendsController.deleteFrontend);
app.patch('/frontends/:name', frontendsController.patchFrontend);
app.get('/frontends/:name/:metric', frontendsController.getFrontendMetric);

app.get('/backends', backendsController.get);
app.get('/backends/:name', backendsController.getBackend);
app.get('/backends/:name/servers', backendsController.getBackendServers);
app.get('/backends/:name/:metric', backendsController.getBackendMetric);

app.get('/servers', serversController.get);
app.get('/servers/:name', serversController.getServer);
app.delete('/servers/:name', serversController.deleteServer);
app.patch('/servers/:name', serversController.patchServer);
app.get('/servers/:name/:metric', serversController.getServerMetric);

app.get('/acls', aclsController.get);
app.get('/acls/:id', aclsController.getAcl);
app.delete('/acls/:id', aclsController.clearAcl);
app.patch('/acls/:id', aclsController.patchAcl);
app.get('/acls/:id/:value', aclsController.getAclValue);
app.delete('/acls/:id/:key', aclsController.deleteAcl);

app.get('/maps', mapsController.get);
app.get('/maps/:id', mapsController.getMap);
app.delete('/maps/:id', mapsController.clearMap);
app.patch('/maps/:id', mapsController.patchMap);
app.get('/maps/:id/:key', mapsController.getMapEntry);
app.delete('/maps/:id/:key', mapsController.deleteMap);

app.get('/tables', tablesController.get);
app.get('/tables/:name', tablesController.getTable);
app.delete('/tables/:name', tablesController.clearTable);
app.patch('/tables/:name', tablesController.patchTable);
app.get('/tables/:name/:key', tablesController.getTableEntry);
app.delete('/tables/:name/:key', tablesController.deleteTableEntry);

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
