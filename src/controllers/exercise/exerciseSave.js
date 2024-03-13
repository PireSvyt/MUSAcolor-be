require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Exercise = require("../../models/Exercise.js");

module.exports = exerciseSave = (req, res, next) => {
  /*
  
  saves a exercise
  
  possible response types
  * exercise.save.error.exerciseid
  * exercise.save.success.modified
  * exercise.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("exercise.save");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  // Save
  if (req.body.exerciseid === "" || req.body.exerciseid === undefined) {
    console.log("exercise.save.error.exerciseid");
    return res.status(503).json({
      type: "exercise.save.error.exerciseid",
      error: error,
    });
  } else {
    // Modify
    let exerciseToSave = { ...req.body };
    exerciseToSave.practicianid = decodedToken.userid
    exerciseToSave.editionDate = new Date()

    // Save
    Exercise.updateOne({ 
      exerciseid: exerciseToSave.exerciseid,
      practicianid: decodedToken.userid
    }, exerciseToSave)
      .then(() => {
        console.log("exercise.save.success.modified");
        return res.status(200).json({
          type: "exercise.save.success.modified",
        });
      })
      .catch((error) => {
        console.log("exercise.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "exercise.save.error.onmodify",
          error: error,
        });
      });
  }
};
