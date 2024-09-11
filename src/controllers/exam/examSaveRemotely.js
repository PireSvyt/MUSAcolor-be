require("dotenv").config();
const Exam = require("../../models/Exam.js");
const Patient = require("../../models/Patient.js");
const User = require("../../models/User.js");

module.exports = examSaveRemotely = (req, res, next) => {
  /*
  
  saves a exam
  
  possible response types
  * exam.saveremotely.error.inputs
  * exam.saveremotely.alreadyperformed
  * exam.saveremotely.success.modified
  * exam.saveremotely.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("exam.saveremotely");
  }

  // Save
  if (req.body.examid === "" || req.body.examid === undefined || 
      req.body.token === "" || req.body.token === undefined || 
      req.body.results === undefined) {
    console.log("exam.saveremotely.error.inputs");
    return res.status(503).json({
      type: "exam.saveremotely.error.inputs",
    });
  } else {
    // Modify
    let examToSave = { ...req.body };
    let examToken = examToSave.token
    examToSave.token = ""

    // Check 
    Exam.findOne({ examid: examToSave.examid, token: examToken })
      .then((exam) => {
          if (exam.results !== undefined) {
            console.log("exam.saveremotely.alreadyperformed");
            return res.status(401).json({
              type: "exam.saveremotely.alreadyperformed",
            }); 
          } else {
            // Save
            Exam.updateOne({ examid: examToSave.examid, token: examToken }, examToSave)
              .then((outcome) => {
                // Notify practician
                Patient.findOne({ patientid: exam.patientid }).then((patient) => {                  
                  User.findOne({ userid: patient.practicianid }).then((practician) => {
                    serviceMailing("notifypracticianofperformedexam", 
                      { practicianlogin: practician.login, 
                        patientid: patient.patientid, 
                        patientname: patient.name
                      }).then(() => {
                        // Send resoinse
                        console.log("exam.saveremotely.success.modified");
                        return res.status(200).json({
                          type: "exam.saveremotely.success.modified",
                        });
                      })  
                  })
                })      
                              })
              .catch((error) => {
                console.log("exam.saveremotely.error.onmodify");
                console.error(error);
                return res.status(400).json({
                  type: "exam.save.error.onmodify",
                  error: error,
                });
              });
          }
        })
  }
};
