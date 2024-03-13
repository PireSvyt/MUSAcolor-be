require("dotenv").config();
const Exercise = require("../../models/Exercise.js");

module.exports = exerciseDelete = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * exercise.delete.success
  * exercise.delete.error.ondeletegames
  * exercise.delete.error.ondeleteexercise
  
  */

  if (process.env.DEBUG) {
    console.log("exercise.delete", req.body);
  }

  Exercise.deleteOne({ exerciseid: req.body.exerciseid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("exercise.delete.success");
        return res.status(200).json({
          type: "exercise.delete.success",
          data: deleteOutcome,
        });
      } else {
        console.log("exercise.delete.error.outcome");
        return res.status(400).json({
          type: "exercise.delete.error.outcome",
          data: deleteOutcome,
        });
      }
    })
    .catch((error) => {
      console.log("exercise.delete.error.ondeleteexercise");
      console.error(error);
      return res.status(400).json({
        type: "exercise.delete.error.ondeleteexercise",
        error: error,
      });
    });
};
