const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const adminAuthenticate = require("../controllers/admin/adminAuthenticate.js");
const authAuthenticatePractician = require("../controllers/auth/authAuthenticatePractician.js");
const authAuthenticatePatient = require("../controllers/auth/authAuthenticatePatient.js");

const examCreate = require("../controllers/exam/examCreate.js");
//const examSave = require("../controllers/exam/examSave.js");
const examGetOne = require("../controllers/exam/examGetOne.js");
const examGetAll = require("../controllers/exam/examGetAll.js");
//const examDelete = require("../controllers/exam/examDelete.js");
const examDeleteMine = require("../controllers/exam/examDeleteMine.js");
const examGetAnalysis = require("../controllers/exam/examGetAnalysis.js");
const examGetRemotely = require("../controllers/exam/examGetRemotely.js");
const examSaveRemotely = require("../controllers/exam/examSaveRemotely.js");

router.post(
  "/v1/create",
  authAuthenticate,
  authAuthenticatePractician,
  authAuthenticatePatient,
  examCreate,
);
/*
router.post(
  "/v1/save",
  authAuthenticate,
  authAuthenticatePractician,
  examSave,
);
router.get(
  "/v1/:examid",
  authAuthenticate,
  authAuthenticatePractician,
  examGetOne,
);
*/
router.post(
  "/v1/getanalysis",
  authAuthenticate,
  authAuthenticatePractician,
  authAuthenticatePatient,
  examGetAnalysis,
);
router.post(
  "/v1/getall",
  authAuthenticate,
  adminAuthenticate,
  examGetAll,
);
/*
router.delete(
  "/v1/:examid",
  authAuthenticate,
  authAuthenticatePractician,
  examDelete,
);
*/
router.post(
  "/v1/delete",
  authAuthenticate,
  authAuthenticatePractician,
  authAuthenticatePatient,
  examDeleteMine,
);
router.post(
  "/v1/getremotely",
  examGetRemotely,
);
router.post(
  "/v1/saveremotely",
  examSaveRemotely,
);

module.exports = router;
