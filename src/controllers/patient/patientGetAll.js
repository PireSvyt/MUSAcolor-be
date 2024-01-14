require("dotenv").config();
const Patient = require("../../models/Patient.js");

module.exports = patientGetAll = (req, res, next) => {
  /*
  
  sends back all the patients
  
  possible response types
  * patients.get.success
  
  */

  if (process.env.DEBUG) {
    console.log("patients.get");
  }

  Patient.find({})
    .then((patients) => {
      if (patients !== undefined) {
        console.log("patient.get.success");
        return res.status(200).json({
          type: "patients.get.success",
          data: {
            patients: patients,
          },
        });
      } else {
        console.log("patient.get.error.notfound");
        return res.status(101).json({
          type: "patients.get.error.notfound",
          data: {
            patients: [],
          },
        });
      }
    })
    .catch((error) => {
      console.log("patients.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "patients.get.error.onfind",
        error: error,
        data: {
          patients: [],
        },
      });
    });
};
