require("dotenv").config();
const Patient = require("../../models/Patient.js");

module.exports = patientDeleteMine = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * patient.deletemine.success
  * patient.deletemine.error.ondeletegames
  * patient.deletemine.error.ondeletepatient
  
  */

  if (process.env.DEBUG) {
    console.log("patient.deletemine");
  }

  Patient.deleteOne({ 
    patientid: req.body.patientid,
    practicianid: req.augmented.user.userid
  })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("patient.deletemine.success");
        return res.status(200).json({
          type: "patient.deletemine.success",
          data: deleteOutcome,
        });
      } else {
        console.log("patient.deletemine.error.outcome");
        return res.status(400).json({
          type: "patient.deletemine.error.outcome",
          data: deleteOutcome,
        });
      }
    })
    .catch((error) => {
      console.log("patient.deletemine.error.ondeletepatient");
      console.error(error);
      return res.status(400).json({
        type: "patient.deletemine.error.ondeletepatient",
        error: error,
      });
    });
};
