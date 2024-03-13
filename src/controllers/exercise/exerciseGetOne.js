require("dotenv").config();
const Exercise = require("../../models/Exercise.js");

module.exports = exerciseGetOne = (req, res, next) => {
  /*
  
  sends back the exercise value
  
  possible response types
  * exercise.get.success
  * exercise.get.error.notfound
  * exercise.get.error.undefined
  
  */

  if (process.env.DEBUG) {
    console.log("exercise.getone");
  }

  Exercise.findOne(
    { exerciseid: req.params.exerciseid }, 
    'exerciseid editionDate name type duration data instructions'
  )
    .then((exercise) => {
      if (exercise !== undefined) {
        console.log("exercise.get.success");
        return res.status(200).json({
          type: "exercise.get.success",
          data: {
            exercise: exercise,
          },
        });
      } else {
        console.log("exercise.get.error.undefined");
        return res.status(101).json({
          type: "exercise.get.error.undefined",
          data: {
            exercise: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("exercise.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "exercise.get.error.onfind",
        error: error,
        data: {
          exercise: undefined,
        },
      });
    });
};
