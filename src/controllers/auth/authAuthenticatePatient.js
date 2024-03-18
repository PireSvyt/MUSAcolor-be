require("dotenv").config();
const User = require("../../models/User.js");

module.exports = authAuthenticatePatient = (req, res, next) => {
  /*
  
  authenticate the patient as one of user patients
  
  possible response types
  * auth.authenticatepatient.error.isnotpatient
  * auth.authenticatepatient.error.missingpatientid
  
  */

  if (process.env.DEBUG) {
    console.log("auth.authenticatepatient");
  }
  
  if (req.augmented.user.type === "admin") {
    next();
  } else if (req.augmented.user.type === "practician") {
    // Assess patient is one of my patients
    if (req.body.patientid !== undefined) {
      console.log("req.augmented", req.augmented)
      if (req.augmented.user.patients.map(patient => {return (patient.patientid)}).includes(req.body.patientid)) {
          next()
      } else {
          return res.status(403).json({
              type: "auth.authenticatepatient.error.isnotpatient",
          });
      }
    } else {
      return res.status(404).json({
          type: "auth.authenticatepatient.error.missingpatientid",
      });
    }
  }
};
