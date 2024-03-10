require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Prescription = require("../../models/Prescription.js");

module.exports = prescriptionSave = (req, res, next) => {
  /*
  
  saves a prescription
  
  possible response types
  * prescription.save.error.prescriptionid
  * prescription.save.success.modified
  * prescription.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("prescription.save");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  // Save
  if (req.body.prescriptionid === "" || req.body.prescriptionid === undefined) {
    console.log("prescription.save.error.prescriptionid");
    return res.status(503).json({
      type: "prescription.save.error.prescriptionid",
      error: error,
    });
  } else {
    // Modify
    let prescriptionToSave = { ...req.body };
    prescriptionToSave.practicianid = decodedToken.userid
    prescriptionToSave.editionDate = new Date()
    prescriptionToSave = new Prescription(prescriptionToSave);
    console.log("prescriptionToSave", prescriptionToSave.toObject())

    // Save
    Prescription.updateOne({ 
      prescriptionid: prescriptionToSave.prescriptionid,
      practicianid: decodedToken.userid
    }, prescriptionToSave)
      .then(() => {
        console.log("prescription.save.success.modified");
        return res.status(200).json({
          type: "prescription.save.success.modified",
        });
      })
      .catch((error) => {
        console.log("prescription.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "prescription.save.error.onmodify",
          error: error,
        });
      });
  }
};
