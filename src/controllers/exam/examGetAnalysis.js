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

function serviceComputeResults (exam) {
  console.log("exam.computeresults");
  let processedExam = {...exam}
  switch (exam.type) {
    case "pvo":
      processedExam.analysis = serviceComputePVO (exam)
      break
    case "luscher8":
      processedExam.analysis = serviceComputeLuscher8 (exam)
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

function serviceComputeLuscher8 (exam) {
  console.log("exam.serviceComputeLuscher8");
  const testColors = {
    '#999999': { id: 0, name: "gris" },
    '#007FFF': { id: 1, name: "bleu" },
    '#2A9248': { id: 2, name: "foret" },
    '#FF0000': { id: 3, name: "rouge" },
    '#FFFF00': { id: 4, name: "jaune" },
    '#BF00BF': { id: 5, name: "pourpre" },
    '#8C4600': { id: 6, name: "marron" },
    '#000000': { id: 7, name: "noir" },
  }
  let analysis = {
    sequences: {
      list: [],
      terms: {}
    }
  }
  
  Object.keys(exam.results.rows).forEach(row => {
    // Gather sequences
    let rowValues = Object.values(exam.results.rows[row].cols)
    analysis.sequences[row].list = rowValues.sort(compareTiles).map(tile => {
      return testColors[tile.color].id
    })
    // Build terms
    analysis.sequences[row].terms = {
      preference: [
        exam.sequences[row].list[0],
        exam.sequences[row].list[1]
      ],
      sympathy: [
        exam.sequences[row].list[2],
        exam.sequences[row].list[3]
      ],
      indifference: [
        exam.sequences[row].list[4],
        exam.sequences[row].list[5]
      ],
      rejection: [
        exam.sequences[row].list[6],
        exam.sequences[row].list[7]
      ],
      fifthterm: [
        exam.sequences[row].list[0],
        exam.sequences[row].list[7]
      ],
    }
  });
  function compareTiles(a, b) {
    let aDate = new Date(a.time)
    let bDate = new Date(b.time)
    return aDate - bDate
  }

  return analysis
}