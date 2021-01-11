/**
 * DELETE /maps/:id
 * Clear all entries for a map
 */
exports.clearMap = (req, res) => {
  res.locals.haproxy
    .clearMap(req.params.id)
    .then(() => res.status(204).end())
    .catch((reason) => res.status(400).send(reason));
};

/**
 * DELETE /maps/:id/:key
 * Delete the map entries corresponding to the key
 */
exports.deleteMap = (req, res) => {
  res.locals.haproxy
    .delMap(req.params.id, req.params.key)
    .then(() => res.status(204).end())
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /maps
 * List all maps
 */
exports.get = (req, res) => {
  res.locals.haproxy
    .showMap()
    .then((maps) => res.json(maps))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /maps/:id
 * Show map
 */
exports.getMap = (req, res) => {
  res.locals.haproxy
    .showMap(req.params.id)
    .then((map) => res.json(map))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /maps/:id/:key
 * Show map entry
 */
exports.getMapEntry = (req, res) => {
  res.locals.haproxy
    .getMap(req.params.id, req.params.key)
    .then((map) => res.json(map))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * PATCH /maps/:id
 * Update map
 */
exports.patchMap = (req, res) => {
  if (!req.body) {
    res.status(400).send("no entries to add");
    return;
  }
  Promise.all(
    Object.keys(req.body).map((key) =>
      res.locals.haproxy.addMap(req.params.id, key, req.body[key])
    )
  )
    .then(() => res.status(204).end())
    .catch((reason) => res.status(400).send(reason));
};
