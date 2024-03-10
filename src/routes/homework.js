const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const authAuthenticatePractician = require("../controllers/auth/authAuthenticatePractician.js");
const authAuthenticatePatient = require("../controllers/auth/authAuthenticatePatient.js");

const homeworkCreate = require("../controllers/homework/homeworkCreate.js");
const homeworkGetOne = require("../controllers/homework/homeworkGetOne.js");
const homeworkSave = require("../controllers/homework/homeworkSave.js");
const homeworkDelete = require("../controllers/homework/homeworkDelete.js");

router.post(
  "/v1/create",
  authAuthenticate,
  authAuthenticatePractician,
  authAuthenticatePatient,
  homeworkCreate,
);
router.post(
  "/v1/save",
  authAuthenticate,
  authAuthenticatePractician,
  homeworkSave,
);
router.get(
  "/v1/:homeworkid",
  authAuthenticate,
  authAuthenticatePractician,
  homeworkGetOne,
);
router.post(
  "/v1/delete",
  authAuthenticate,
  authAuthenticatePractician,
  authAuthenticatePatient,
  homeworkDelete,
);

module.exports = router;
