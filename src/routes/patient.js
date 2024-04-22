const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const adminAuthenticate = require("../controllers/admin/adminAuthenticate.js");
const authAuthenticatePractician = require("../controllers/auth/authAuthenticatePractician.js");
const authAuthenticatePatient = require("../controllers/auth/authAuthenticatePatient.js");

const patientCreate = require("../controllers/patient/patientCreate.js");
const patientSave = require("../controllers/patient/patientSave.js");
//const patientGetOne = require("../controllers/patient/patientGetOne.js");
const patientGetMine = require("../controllers/patient/patientGetMine.js");
const patientGetAll = require("../controllers/patient/patientGetAll.js");
const patientDelete = require("../controllers/patient/patientDelete.js");
const patientDeleteMine = require("../controllers/patient/patientDeleteMine.js");

router.post(
  "/v1/create",
  authAuthenticate,
  authAuthenticatePractician,
  patientCreate,
);
router.post(
  "/v1/save",
  authAuthenticate,
  authAuthenticatePractician,
  authAuthenticatePatient,
  patientSave,
);
/*
router.get(
  "/v1/:patientid",
  authAuthenticate,
  adminAuthenticate,
  patientGetOne,
);
*/
router.post(
  "/v1/getmine",
  authAuthenticate,
  authAuthenticatePractician,
  authAuthenticatePatient,
  patientGetMine,
);
router.post(
  "/v1/getall",
  authAuthenticate,
  adminAuthenticate,
  patientGetAll,
);
router.delete(
  "/v1/:patientid",
  authAuthenticate,
  adminAuthenticate,
  patientDelete,
);
router.post(
  "/v1/deletemine",
  authAuthenticate,
  authAuthenticatePractician,
  authAuthenticatePatient,
  patientDeleteMine,
);

module.exports = router;
