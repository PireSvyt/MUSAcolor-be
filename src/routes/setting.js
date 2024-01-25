const express = require("express");
const router = express.Router();

const authAuthenticate = require("../controllers/auth/authAuthenticate.js");

const settingCreate = require("../controllers/setting/settingCreate.js");
const settingSave = require("../controllers/setting/settingSave.js");
const settingGetOne = require("../controllers/setting/settingGetOne.js");
const settingGetAll = require("../controllers/setting/settingGetAll.js");
const settingDelete = require("../controllers/setting/settingDelete.js");

router.post("/v1/create", authAuthenticate, adminAuthenticate, settingCreate);
router.post("/v1/save", authAuthenticate, adminAuthenticate, settingSave);
router.post("/v1/getone/:key", authAuthenticate, settingGetOne);
router.post(
    "/v1/getall", 
    authAuthenticate, 
    adminAuthenticate, 
    settingGetAll
);
router.post(
    "/v1/delete/:key", 
    authAuthenticate, 
    adminAuthenticate, 
    settingDelete
);

module.exports = router;
