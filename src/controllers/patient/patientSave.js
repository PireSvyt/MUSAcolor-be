require("dotenv").config();
const Patient = require("../../models/Patient.js");

module.exports = patientSave = (req, res, next) => {
  /*
  
  saves a patient
  
  possible response types
  * patient.save.error.patientid
  * patient.save.success.modified
  * patient.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("patient.save");
  }

  // Save
  if (req.body.patientid === "" || req.body.patientid === undefined) {
    console.log("patient.save.error.patientid");
    return res.status(503).json({
      type: "patient.save.error.patientid",
      error: error,
    });
  } else {
    // Modify
    let patientToSave = { ...req.body };

    // Save
    Patient.updateOne({ patientid: patientToSave.patientid }, patientToSave)
      .then(() => {
        console.log("patient.save.success.modified");
        return res.status(200).json({
          type: "patient.save.success.modified",
        });
      })
      .catch((error) => {
        console.log("patient.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "patient.save.error.onmodify",
          error: error,
        });
      });
  }
};
