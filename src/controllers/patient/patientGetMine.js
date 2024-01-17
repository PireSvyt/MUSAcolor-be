require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Patient = require("../../models/Patient.js");

module.exports = patientGetMine = (req, res, next) => {
  /*
  
  sends back the patient value
  
  possible response types
  * patient.getmine.success
  * patient.getmine.error.notfound
  * patient.getmine.error.undefined
  
  */

  if (process.env.DEBUG) {
    console.log("patient.getmine");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  Patient.findOne({ patientid: req.params.patientid, practicianid: decodedToken.userid })
    .then((patient) => {
      if (patient !== undefined) {
        console.log("patient.getmine.success");
        return res.status(200).json({
          type: "patient.getmine.success",
          data: {
            patient: patient,
          },
        });
      } else {
        console.log("patient.getmine.error.undefined");
        return res.status(101).json({
          type: "patient.getmine.error.undefined",
          data: {
            patient: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("patient.getmine.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "patient.getmine.error.onfind",
        error: error,
        data: {
          patient: undefined,
        },
      });
    });
  
  Patient.aggregate([
    {
      $match: { 
        patientid: req.params.patientid, 
        practicianid: decodedToken.userid
      },
    },
    {
      $lookup: {
        from: "exams",
        foreignField: "patientid",
        localField: "patientid",
        as: "exams",
        pipeline: [
          {
            $project: {
              _id: 0,
              examid: 1,
              type: 1,
              date: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        patientid: 1,
        name: 1,
      },
    },
  ])
    .then((patients) => {
      if (patients.length === 1) {
        let patientToSend = patients[0];
        return res.status(200).json({
          type: "patient.getmine.success",
          data: {
            patient: patientToSend,
          },
        });
      } else {
        console.log("patient.getmine.error.onfinduser");
        return res.status(400).json({
          type: "patient.getmine.error.onfinduser",
        });
      }
    })
    .catch((error) => {
      console.log("patient.getmine.error.onaggregate");
      console.error(error);
      res.status(400).json({
        type: "patient.getmine.error.onaggregate",
        error: error,
      });
    });
};
