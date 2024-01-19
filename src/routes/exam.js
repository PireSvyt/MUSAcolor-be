const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");
const authAuthenticateAsPractician = require("../controllers/auth/authAuthenticateAsPractician.js");

const examCreate = require("../controllers/exam/examCreate.js");
//const examSave = require("../controllers/exam/examSave.js");
const examGetOne = require("../controllers/exam/examGetOne.js");
//const examGetAll = require("../controllers/exam/examGetAll.js");
//const examDelete = require("../controllers/exam/examDelete.js");
const examDeleteMine = require("../controllers/exam/examDeleteMine.js");
const examGetAnalysis = require("../controllers/exam/examGetAnalysis.js");

router.post(
  "/v1/create",
  authAuthenticate,
  authAuthenticateAsPractician,
  examCreate,
);
/*
router.post(
  "/v1/save",
  authAuthenticate,
  authAuthenticateAsPractician,
  examSave,
);
router.get(
  "/v1/:examid",
  authAuthenticate,
  authAuthenticateAsPractician,
  examGetOne,
);
*/
router.post(
  "/v1/getanalysis",
  authAuthenticate,
  authAuthenticateAsPractician,
  examGetAnalysis,
);
/*
router.get(
  "/v1",
  authAuthenticate,
  authAuthenticateAsPractician,
  examGetAll,
);
router.delete(
  "/v1/:examid",
  authAuthenticate,
  authAuthenticateAsPractician,
  examDelete,
);
*/
router.post(
  "/v1/delete",
  authAuthenticate,
  authAuthenticateAsPractician,
  examDeleteMine,
);

module.exports = router;
