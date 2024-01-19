const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const authAuthenticateAsPractician = require("../controllers/auth/authAuthenticateAsPractician.js");

const patientCreate = require("../controllers/patient/patientCreate.js");
const patientSave = require("../controllers/patient/patientSave.js");
//const patientGetOne = require("../controllers/patient/patientGetOne.js");
const patientGetMine = require("../controllers/patient/patientGetMine.js");
//const patientGetAll = require("../controllers/patient/patientGetAll.js");
//const patientDelete = require("../controllers/patient/patientDelete.js");
const patientDeleteMine = require("../controllers/patient/patientDeleteMine.js");

router.post(
  "/v1/create",
  authAuthenticate,
  authAuthenticateAsPractician,
  patientCreate,
);
router.post(
  "/v1/save",
  authAuthenticate,
  authAuthenticateAsPractician,
  patientSave,
);
/*
router.get(
  "/v1/:patientid",
  authAuthenticate,
  authAuthenticateAsPractician,
  patientGetOne,
);
*/
router.get(
  "/v1/:patientid",
  authAuthenticate,
  authAuthenticateAsPractician,
  patientGetMine,
);
/*
router.get(
  "/v1",
  authAuthenticate,
  authAuthenticateAsPractician,
  patientGetAll,
);
router.delete(
  "/v1/:patientid",
  authAuthenticate,
  authAuthenticateAsPractician,
  patientDelete,
);
*/
router.post(
  "/v1/delete",
  authAuthenticate,
  authAuthenticateAsPractician,
  patientDeleteMine,
);

module.exports = router;
