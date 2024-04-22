require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Exercise = require("../../models/Exercise.js");

module.exports = exerciseCreate = (req, res, next) => {
  /*
  
  ...
  
  possible response types 
  * exercise.create.success
  * exercise.create.error.oncreate
  * exercise.create.error.idprovided
  
  */

  if (process.env.DEBUG) {
    console.log("exercise.create");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  // Save
  let exerciseToSave = { ...req.body };
  exerciseToSave.practicianid = decodedToken.userid
  exerciseToSave.editionDate = new Date()
  exerciseToSave = new Exercise(exerciseToSave);
  console.log("exerciseToSave", exerciseToSave.toObject())

  // Save
  exerciseToSave
    .save()
    .then(() => {
      console.log("exercise.create.success");
      return res.status(201).json({
        type: "exercise.create.success",
        data: {
          exerciseid: exerciseToSave.exerciseid,
        },
      });
    })
    .catch((error) => {
      console.log("exercise.create.error.oncreate");
      console.log(error);
      return res.status(400).json({
        type: "exercise.create.error.oncreate",
        error: error,
        data: {
          exerciseid: null,
        },
      });
    });
};
