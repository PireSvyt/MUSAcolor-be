require("dotenv").config();
const Exam = require("../../models/Exam.js");

module.exports = examDeleteMine = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * exam.deletemine.success
  * exam.deletemine.error.ondeletegames
  * exam.deletemine.error.ondeletepatient
  
  */

  if (process.env.DEBUG) {
    console.log("exam.deletemine");
  }

  Exam.deleteOne({ 
    examid: req.body.examid,
    patientid: req.body.patientid
  })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("exam.deletemine.success");
        return res.status(200).json({
          type: "exam.deletemine.success",
          data: deleteOutcome,
        });
      } else {
        console.log("exam.deletemine.error.outcome");
        return res.status(400).json({
          type: "exam.deletemine.error.outcome",
          data: deleteOutcome,
        });
      }
    })
    .catch((error) => {
      console.log("exam.deletemine.error.ondeletepatient");
      console.error(error);
      return res.status(400).json({
        type: "exam.deletemine.error.ondeletepatient",
        error: error,
      });
    });
};
