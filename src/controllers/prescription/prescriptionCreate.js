require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Prescription = require("../../models/Prescription.js");

module.exports = prescriptionCreate = (req, res, next) => {
  /*
  
  ...
  
  possible response types 
  * prescription.create.success
  * prescription.create.error.oncreate
  * prescription.create.error.idprovided
  
  */

  if (process.env.DEBUG) {
    console.log("prescription.create");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  // Save
  let prescriptionToSave = { ...req.body };
  prescriptionToSave.practicianid = decodedToken.userid
  prescriptionToSave.editionDate = new Date()
  console.log("prescriptionToSave", prescriptionToSave.toObject())
  prescriptionToSave = new Prescription(prescriptionToSave);

  // Save
  prescriptionToSave
    .save()
    .then(() => {
      console.log("prescription.create.success");
      return res.status(201).json({
        type: "prescription.create.success",
        data: {
          prescriptionid: prescriptionToSave.prescriptionid,
        },
      });
    })
    .catch((error) => {
      console.log("prescription.create.error.oncreate");
      console.log(error);
      return res.status(400).json({
        type: "prescription.create.error.oncreate",
        error: error,
        data: {
          prescriptionid: null,
        },
      });
    });
};
