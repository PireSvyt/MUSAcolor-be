require("dotenv").config();
const Exam = require("../../models/Exam.js");
const serviceComputeResults = require("./services/serviceComputeResults.js")

module.exports = examGetList = (req, res, next) => {
  /*
  
  sends back the exams from the request ids
  
  possible response types
  * exam.getlist.success
  * exam.getlist.error
  
  */

  if (process.env.DEBUG) {
    console.log("exam.getlist");
  }

  Exam.find({
	  patientid: req.body.patientid,
	  type: req.body.type,
	  examid: { $in : req.body.examids },
  })
    .then((exams) => {
      if (exams.length > 0) {
        // Process results
        let examsToSend = []
        exams.forEach(exam => {
          examsToSend.push(serviceComputeResults(exam.toObject()))
        })
        console.log("exam.getlist.success");
        return res.status(200).json({
          type: "exam.getlist.success",
          data: {
            exams: examsToSend,
          },
        });
      } else {
        console.log("exam.getlist.error");
        return res.status(403).json({
          type: "exam.getlist.error",
          data: {
            exams: [],
          },
        });
      }
    })
    .catch((error) => {
      console.log("exam.getlist.error");
      console.error(error);
      return res.status(400).json({
        type: "exam.getlist.error",
        error: error,
        data: {
          exams: [],
        },
      });
    });
};