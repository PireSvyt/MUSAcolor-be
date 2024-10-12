module.exports = function serviceComputeResults (exam) {
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
      rows: []
    }
    function compareTiles(a, b) {
      let aDate = new Date(a.time)
      let bDate = new Date(b.time)
      return aDate - bDate
    }
    
    Object.keys(exam.results.rows).forEach(row => {
      analysis.rows[row] = {
        sequence: [],
        terms: {}
      }
      // Gather sequences
      let rowValues = Object.values(exam.results.rows[row].cols)
      //console.log("rowValues", rowValues)
      let sortedValues = rowValues.sort(compareTiles)
      //console.log("sortedValues", sortedValues)
      let mappedValues = sortedValues.map(tile => {
        return testColors[tile.color].id
      })
      //console.log("mappedValues", mappedValues)
      analysis.rows[row].sequence = mappedValues
      // Build terms
      analysis.rows[row].terms = {
        preference: [
          analysis.rows[row].sequence[0],
          analysis.rows[row].sequence[1]
        ],
        sympathy: [
          analysis.rows[row].sequence[2],
          analysis.rows[row].sequence[3]
        ],
        indifference: [
          analysis.rows[row].sequence[4],
          analysis.rows[row].sequence[5]
        ],
        rejection: [
          analysis.rows[row].sequence[6],
          analysis.rows[row].sequence[7]
        ],
        fifthterm: [
          analysis.rows[row].sequence[0],
          analysis.rows[row].sequence[7]
        ],
      }
    })
    return analysis
}