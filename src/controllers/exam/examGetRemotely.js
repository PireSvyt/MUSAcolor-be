require("dotenv").config();
const Exam = require("../../models/Exam.js");

module.exports = examGetRemotely = (req, res, next) => {
  /*
  
  sends back the exam to be performed if not yet performed
  
  possible response types
  * exam.getremotely.success
  * exam.getremotely.alreadyperformed
  * exam.getremotely.error.denied
  * exam.getremotely.error.notfound
  
  */

  if (process.env.DEBUG) {
    console.log("exam.getremotely");
  }

  Exam.findOne({ token: req.params.examtoken })
    .then((exam) => {
      if (exam !== undefined) {
        if (exam.results !== undefined) {
          console.log("exam.getremotely.alreadyperformed");
          return res.status(401).json({
            type: "exam.getremotely.alreadyperformed",
            data: {
              exam: undefined,
            },
          });          
        }        
        // Cleaning prior sending to patient
        let examToSend = {}
        const keysToSend = [ "schema", "examid", "type"]
        keysToSend.examid = exam.examid 
        keysToSend.type = exam.type
        console.log("exam.getremotely.success");
        return res.status(200).json({
          type: "exam.getremotely.success",
          data: {
            exam: examToSend,
          },
        });
      } else {
        console.log("exam.getremotely.error.denied");
        return res.status(403).json({
          type: "exam.getremotely.error.denied",
          data: {
            exam: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("exam.getremotely.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "exam.getremotely.error.onfind",
        error: error,
        data: {
          exam: undefined,
        },
      });
    });
};
