require("dotenv").config();
const Exam = require("../../models/Exam.js");
const serviceComputeResults = require("./services/serviceComputeResults.js")

module.exports = examGetAnalysis = (req, res, next) => {
  /*
  
  sends back the exam value
  
  possible response types
  * exam.getanalysis.success
  * exam.getanalysis.error.notfound
  * exam.getanalysis.error.undefined
  
  */

  if (process.env.DEBUG) {
    console.log("exam.getanalysis");
  }
  Exam.findOne({ 
    examid: req.body.examid,
    patientid: req.body.patientid
  }, "examid patientid type date results")
    .then((exam) => {
      if (exam !== undefined && exam !== null) {
        console.log("exam.getanalysis.success", exam.toObject());
        let processedExam = serviceComputeResults(exam.toObject())
        return res.status(200).json({
          type: "exam.getanalysis.success",
          data: {
            exam: processedExam,
          },
        });
      } else {
        console.log("exam.getanalysis.error.undefined");
        return res.status(404).json({
          type: "exam.getanalysis.error.undefined",
          data: {
            exam: {
              examid: null,
              patientid: null,
              type: null,
              date: null,
              results: null,
              analysis: null
            },
          },
        });
      }
    })
    .catch((error) => {
      console.log("exam.getanalysis.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "exam.getanalysis.error.onfind",
        error: error,
        data: {
          exam: {
            examid: null,
            patientid: null,
            type: null,
            date: null,
            results: null,
            analysis: null
          },
        },
      });
    });
};

