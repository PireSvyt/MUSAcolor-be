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
      if (exam !== undefined) {
        console.log("exam.getanalysis.success");
        let processedExam = serviceComputeResults(exam)
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
              results: null
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
            results: null
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
      processedExam.analysis = {}
  }
  return processedExam
}

function serviceComputePVO (exam) {
  console.log("exam.serviceComputePVO");
  /*let res = {
    time: 12,
    rows: [
      {
        cells: [
          {
            color: "#123",
            state: "visible"
          },
          {
            color: "#456",
            state: "hidden"
          }
        ]
      }
    ]
  }
  */
  let analysis = {
    colors: {}
  }
  exam.results.rows.forEach(row => {
    row.cells.forEach((cell) => {
      if (analysis.colors[cell.color] === undefined) {
        analysis.colors[cell.color] = 0
      }
      if (analysis.colors[cell.state] === "visible") {
        analysis.colors[cell.state] += 1
      }
    })
  });
  return analysis
}