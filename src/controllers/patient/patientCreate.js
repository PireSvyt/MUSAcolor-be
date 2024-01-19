require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Patient = require("../../models/Patient.js");

module.exports = patientCreate = (req, res, next) => {
  /*
  
  ...
  
  possible response types 
  * patient.create.success
  * patient.create.error.oncreate
  * patient.create.error.idprovided
  
  */

  if (process.env.DEBUG) {
    console.log("patient.create");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  // Save
  let patientToSave = { ...req.body };
  patientToSave.practicianid = decodedToken.userid
  patientToSave = new Patient(patientToSave);

  // Save
  patientToSave
    .save()
    .then(() => {
      console.log("patient.create.success");
      return res.status(201).json({
        type: "patient.create.success",
        data: {
          patientid: patientToSave.patientid,
        },
      });
    })
    .catch((error) => {
      console.log("patient.create.error.oncreate");
      console.log(error);
      return res.status(400).json({
        type: "patient.create.error.oncreate",
        error: error,
        data: {
          patientid: null,
        },
      });
    });
};
