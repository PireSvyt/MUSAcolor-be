const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const adminAuthenticate = require("../controllers/admin/adminAuthenticate.js");

const adminDatabaseCommand = require("../controllers/admin/adminDatabaseCommand");

router.post(
  "/v1/databasecommand",
  authAuthenticate,
  adminAuthenticate,
  adminDatabaseCommand,
);

module.exports = router;
