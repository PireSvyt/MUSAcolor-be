require("dotenv").config();
const Exercise = require("../../models/Exercise.js");

module.exports = exerciseGetMine = (req, res, next) => {
  /*
  
  sends back the user value
  
  possible response types
  * exercise.getmine.success
  * exercise.getmine.error.onfinduser
  * exercise.getmine.error.onaggregate
  
  */

  if (process.env.DEBUG) {
    console.log("exercise.getmine");
  }

  Exercise.aggregate([
    {
      $match: { practicianid: req.augmented.user.userid },
    },
    {
      $project: {
        _id: 0,
        exerciseid: 1,
        editionDate: 1,
        name: 1,
        type: 1,
        data: 1,
      },      
    },
  ])
    .then((exercises) => {
      return res.status(200).json({
        type: "exercise.getmine.success",
        data: {
          exercises: exercises,
        },
      });
    })
    .catch((error) => {
      console.log("exercise.getmine.error.onaggregate");
      console.error(error);
      res.status(400).json({
        type: "exercise.getmine.error.onaggregate",
        error: error,
      });
    });
};
