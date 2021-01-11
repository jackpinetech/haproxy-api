/**
 * DELETE /acls/:id
 * Clear all entries for a acl
 */
exports.clearAcl = (req, res) => {
  res.locals.haproxy
    .clearAcl(req.params.id)
    .then(() => res.status(204).end())
    .catch((reason) => res.status(400).send(reason));
};

/**
 * DELETE /acls/:id/:key
 * Delete the acl entries corresponding to the key
 */
exports.deleteAcl = (req, res) => {
  res.locals.haproxy
    .delAcl(req.params.id, req.params.key)
    .then(() => res.status(204).end())
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /acls
 * List all acls
 */
exports.get = (req, res) => {
  res.locals.haproxy
    .showAcl()
    .then((acls) => res.json(acls))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /acls/:id
 * Show acl
 */
exports.getAcl = (req, res) => {
  res.locals.haproxy
    .showAcl(req.params.id)
    .then((acl) => res.json(acl))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * GET /acls/:id/:value
 * Show acl entry
 */
exports.getAclValue = (req, res) => {
  res.locals.haproxy
    .getAcl(req.params.id, req.params.value)
    .then((acl) => res.json(acl))
    .catch((reason) => res.status(400).send(reason));
};

/**
 * PATCH /acls/:id
 * Update acl
 */
exports.patchAcl = (req, res) => {
  if (!req.body["pattern"]) {
    res.status(400).send("invalid pattern");
    return;
  }
  res.locals.haproxy
    .addAcl(req.params.id, req.body["pattern"])
    .then(() => res.status(204).end())
    .catch((reason) => res.status(400).send(reason));
};
