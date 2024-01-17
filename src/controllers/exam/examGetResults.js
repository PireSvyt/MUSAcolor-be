require("dotenv").config();
const Exam = require("../../models/Exam.js");

module.exports = examGetResults = (req, res, next) => {
  /*
  
  sends back the exam value
  
  possible response types
  * exam.get.success
  * exam.get.error.notfound
  * exam.get.error.undefined
  
  */

  if (process.env.DEBUG) {
    console.log("exam.getresults");
  }
  Exam.findOne({ examid: req.params.examid }, "examid patientid type date results")
    .then((exam) => {
      if (exam !== undefined) {
        console.log("exam.get.success");
        let processedExam = serviceComputeResults(exam)
        return res.status(200).json({
          type: "exam.get.success",
          data: {
            exam: processedExam,
          },
        });
      } else {
        console.log("exam.get.error.undefined");
        return res.status(101).json({
          type: "exam.get.error.undefined",
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
      console.log("exam.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "exam.get.error.onfind",
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