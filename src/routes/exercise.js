const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const authAuthenticatePractician = require("../controllers/auth/authAuthenticatePractician.js");
const authAuthenticatePatient = require("../controllers/auth/authAuthenticatePatient.js");

const exerciseCreate = require("../controllers/exercise/exerciseCreate.js");
const exerciseGetOne = require("../controllers/exercise/exerciseGetOne.js");
const exerciseSave = require("../controllers/exercise/exerciseSave.js");
const exerciseDelete = require("../controllers/exercise/exerciseDelete.js");

router.post(
  "/v1/create",
  authAuthenticate,
  authAuthenticatePractician,
  exerciseCreate,
);
router.post(
  "/v1/save",
  authAuthenticate,
  authAuthenticatePractician,
  exerciseSave,
);
router.post(
  "/v1/get",
  authAuthenticate,
  authAuthenticatePractician,
  exerciseGetOne,
);
router.post(
  "/v1/delete",
  authAuthenticate,
  authAuthenticatePractician,
  exerciseDelete,
);

module.exports = router;
