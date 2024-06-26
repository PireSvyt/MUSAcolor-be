require("dotenv").config();
const User = require("../../models/User.js");
const Patient = require("../../models/Patient.js");
const Exam = require("../../models/Exam.js");
const Exercise = require("../../models/Exercise.js");
const Prescription = require("../../models/Prescription.js");
const Setting = require("../../models/Setting.js");

module.exports = adminGetObjectCount = (req, res, next) => {
  /*
  
  provides user details reporting
  
  possible response types
  * admin.databaseload.success
  * admin.databaseload.error.deniedaccess
  * admin.databaseload.error.oncountusers
  * admin.databaseload.error.oncountpatients
  * admin.databaseload.error.oncountexams
  * admin.databaseload.error.oncountexercises
  * admin.databaseload.error.oncountprescription
  * admin.databaseload.error.oncountsettings
  
  */

  if (process.env.DEBUG) {
    console.log("admin.databaseload");
  }

  // User.count() // count without break down
  User
  .aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]) // count with break down
  .then((users) => {
    Patient
    .count()
    .then((patients) => {
      // Exam.count() // count without break down
      Exam
      .aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]) // count with break down
      .then((exams) => {
        Exercise
        .aggregate([
          {
            $group: {
              _id: '$type',
              count: { $sum: 1 }
            }
          }
        ]) // count with break down
        .then((execrises) => {
          Prescription.count()
          .then((prescriptions) => {
            Setting
            .count()
            .then((settings) => {
              // Response
              res.status(200).json({
                type: "admin.databaseload.success",
                data: {
                  users: users,
                  patients: patients,
                  exams: exams,
                  execrises: execrises,
                  prescriptions: prescriptions,
                  settings: settings,
                },
              });
            })
            .catch((error) => {
              res.status(400).json({
                type: "admin.databaseload.error.oncountsettings",
                error: error,
              });
              console.error(error);
            });
          })
          .catch((error) => {
            res.status(400).json({
              type: "admin.databaseload.error.oncountprescriptions",
              error: error,
            });
            console.error(error);
          });
        })
        .catch((error) => {
          res.status(400).json({
            type: "admin.databaseload.error.oncountexecrises",
            error: error,
          });
          console.error(error);
        });
      })
      .catch((error) => {
        res.status(400).json({
          type: "admin.databaseload.error.oncountexams",
          error: error,
        });
        console.error(error);
      });
    })
    .catch((error) => {
      res.status(400).json({
        type: "admin.databaseload.error.oncountpatients",
        error: error,
      });
      console.error(error);
    });
  })
  .catch((error) => {
    res.status(400).json({
      type: "admin.databaseload.error.oncountusers",
      error: error,
    });
    console.error(error);
  });
};