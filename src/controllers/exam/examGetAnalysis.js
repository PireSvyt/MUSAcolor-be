require("dotenv").config();
const Exam = require("../../models/Exam.js");

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
        return res.status(101).json({
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

function serviceComputeResults (exam) {
  console.log("exam.computeresults");
  let processedExam = {...exam}
  switch (exam.type) {
    case "pvo":
      processedExam.analysis = serviceComputePVO (exam)
      break
    default:
      console.error("exam.computeresults unmatched type", exam.type)
      processedExam.analysis = null
  }
  return processedExam
}

function serviceComputePVO (exam) {
  console.log("exam.serviceComputePVO");
  let analysis = {
    colors: {}
  }
  Object.keys(exam.results.rows).forEach(row => {
    Object.keys(exam.results.rows[row].cols).forEach(col => {
      if (analysis.colors[exam.results.rows[row].cols[col].color] === undefined) {
        analysis.colors[exam.results.rows[row].cols[col].color] = 0
      }
      if (exam.results.rows[row].cols[col].state === "visible") {
        analysis.colors[exam.results.rows[row].cols[col].color] += 1
      }
    })
  });
  return analysis
}