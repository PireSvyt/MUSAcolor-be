require("dotenv").config();
const Prescription = require("../../models/Prescription.js");

module.exports = prescriptionGetOne = (req, res, next) => {
  /*
  
  sends back the prescription value
  
  possible response types
  * prescription.get.success
  * prescription.get.error.notfound
  * prescription.get.error.undefined
  
  */

  if (process.env.DEBUG) {
    console.log("prescription.getone");
  }

  Prescription.aggregate([
    {
      $match: { 
        prescriptionid: req.params.prescriptionid
      },
    },
    {
      $lookup: {
        from: "exercises",
        foreignField: "exerciseid",
        localField: "exercises.exerciseid",
        as: "aggregatedExercises",
        pipeline: [
          {
            $project: {
              _id: 0,
              exerciseid: 1,
              editionDate: 1,
              name: 1,
              type: 1,
              duration: 1,
              instructions: 1,
              data: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        creationDate: 1,
        editionDate: 1,
        exercises: 1,
        aggregatedExercises: 1
      },
    }
  ])
    .then((prescription) => {
      if (prescription !== undefined) {
        console.log("prescription.get.success");
        console.log("prescription", prescription);
        // Repackaging
        let outcome = {...prescription[0]}
        let exercises = []
        let keysToRemove = [ '_id', 'practicianid', 'editionDate', '__v' ]
        prescription.exercises.forEach(exercise => {
          let consoleidatedExercise = {...exercise}
          if (consoleidatedExercise.exerciseid !== 'userDefined') {
            let myExercise = outcome.exercises.filter(ex => ex.exerciseid === exercise.exerciseid)[0]
            Object.keys(myExercise).forEach(k => {
              if (!keysToRemove.includes(k)) {
                consoleidatedExercise[k] = myExercise[k]
              }
            })
          }
          exercises.push(consoleidatedExercise)
        })
        outcome.exercises = exercises
        delete outcome.aggregatedExercises
        console.log("exercises", exercises);
        // Response
        return res.status(200).json({
          type: "prescription.get.success",
          data: {
            prescription: outcome,
          },
        });
      } else {
        console.log("prescription.get.error.undefined");
        return res.status(101).json({
          type: "prescription.get.error.undefined",
          data: {
            prescription: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("prescription.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "prescription.get.error.onfind",
        error: error,
        data: {
          prescription: undefined,
        },
      });
    });
};
