const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const authAuthenticatePractician = require("../controllers/auth/authAuthenticatePractician.js");
const authAuthenticatePatient = require("../controllers/auth/authAuthenticatePatient.js");

const prescriptionCreate = require("../controllers/prescription/prescriptionCreate.js");
const prescriptionGetOne = require("../controllers/prescription/prescriptionGetOne.js");
const prescriptionSave = require("../controllers/prescription/prescriptionSave.js");
const prescriptionDelete = require("../controllers/prescription/prescriptionDelete.js");

router.post(
  "/v1/create",
  authAuthenticate,
  authAuthenticatePractician,
  authAuthenticatePatient,
  prescriptionCreate,
);
router.post(
  "/v1/save",
  authAuthenticate,
  authAuthenticatePractician,
  prescriptionSave,
);
router.get(
  "/v1/:prescriptionid",
  prescriptionGetOne,
);
router.post(
  "/v1/delete",
  authAuthenticate,
  authAuthenticatePractician,
  authAuthenticatePatient,
  prescriptionDelete,
);

module.exports = router;
