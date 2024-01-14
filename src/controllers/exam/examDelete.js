require("dotenv").config();
const Exam = require("../../models/Exam.js");

module.exports = patientDelete = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * patient.delete.success
  * patient.delete.error.ondeletegames
  * patient.delete.error.ondeletepatient
  
  */

  if (process.env.DEBUG) {
    console.log("patient.delete");
  }

  Exam.deleteOne({ examid: req.params.examid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("patient.delete.success");
        return res.status(200).json({
          type: "patient.delete.success",
          data: deleteOutcome,
        });
      } else {
        console.log("patient.delete.error.outcome");
        return res.status(400).json({
          type: "patient.delete.error.outcome",
          data: deleteOutcome,
        });
      }
    })
    .catch((error) => {
      console.log("patient.delete.error.ondeletepatient");
      console.error(error);
      return res.status(400).json({
        type: "patient.delete.error.ondeletepatient",
        error: error,
      });
    });
};
