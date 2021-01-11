/**
 * DELETE /tables/:name
 * Clear all entries for a stick-table
 */
exports.clearTable = (req, res) => {
  res.locals.haproxy
    .clearTable(req.params.name)
    .then(() => res.status(204).end())
    .catch((reason) => res.status(400).send(reason));
};

/**
 * DELETE /tables/:name/:key
 * Clear all entries for a stick-table corresponding to the key
 */
exports.deleteTableEntry = (req, res) => {
  res.locals.haproxy
    .delTable(req.params.name, req.params.key)
    .then(() => res.status(204).end())
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /tables
 * List all stick-tables
 */
exports.get = (req, res) => {
  res.locals.haproxy
    .showTable()
    .then((tables) => res.json(tables))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /tables/:name
 * Show stick-table
 */
exports.getTable = (req, res) => {
  res.locals.haproxy
    .showTable(req.params.name)
    .then((table) => res.json(table))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /tables/:name/:key
 * Show stick-table entry
 */
exports.getTableEntry = (req, res) => {
  res.locals.haproxy
    .getTable(req.params.name, req.params.key)
    .then((table) => res.json(table))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * PATCH /tables/:name
 * Update stick-table
 */
exports.patchTable = (req, res) => {
  if (!req.body) {
    res.status(400).send("no entries to add");
    return;
  }
  Promise.all(
    Object.keys(req.body).map((key) =>
      res.locals.haproxy.setTable(req.params.name, key, req.body[key])
    )
  )
    .then(() => res.status(204).end())
    .catch((reason) => res.status(400).send(reason));
};
