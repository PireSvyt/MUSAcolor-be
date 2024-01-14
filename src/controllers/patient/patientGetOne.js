require("dotenv").config();
const Patient = require("../../models/Patient.js");

module.exports = patientGetOne = (req, res, next) => {
  /*
  
  sends back the patient value
  
  possible response types
  * patient.get.success
  * patient.get.error.notfound
  * patient.get.error.undefined
  
  */

  if (process.env.DEBUG) {
    console.log("patient.getone");
  }

  Patient.findOne({ patientid: req.params.patientid })
    .then((patient) => {
      if (patient !== undefined) {
        console.log("patient.get.success");
        return res.status(200).json({
          type: "patient.get.success",
          data: {
            patient: patient,
          },
        });
      } else {
        console.log("patient.get.error.undefined");
        return res.status(101).json({
          type: "patient.get.error.undefined",
          data: {
            patient: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("patient.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "patient.get.error.onfind",
        error: error,
        data: {
          patient: undefined,
        },
      });
    });
};
