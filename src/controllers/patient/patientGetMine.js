require("dotenv").config();
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
  
  Patient.aggregate([
    {
      $match: { 
        patientid: req.body.patientid, 
        practicianid: req.augmented.user.userid
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
      $lookup: {
        from: "homeworks",
        foreignField: "homeworkid",
        localField: "homeworkid",
        as: "homeworks",
        pipeline: [
          {
            $project: {
              _id: 0,
              homeworkid: 1,
              type: 1,
              editionDate: 1,
              exercises: 1
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
        exams: 1,
        homeworks: 1
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
