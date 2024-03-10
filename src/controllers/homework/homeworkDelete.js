require("dotenv").config();
const Homework = require("../../models/Homework.js");

module.exports = homeworkDelete = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * homework.delete.success
  * homework.delete.error.ondeletegames
  * homework.delete.error.ondeletehomework
  
  */

  if (process.env.DEBUG) {
    console.log("homework.delete");
  }

  Homework.deleteOne({ homeworkid: req.params.homeworkid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("homework.delete.success");
        return res.status(200).json({
          type: "homework.delete.success",
          data: deleteOutcome,
        });
      } else {
        console.log("homework.delete.error.outcome");
        return res.status(400).json({
          type: "homework.delete.error.outcome",
          data: deleteOutcome,
        });
      }
    })
    .catch((error) => {
      console.log("homework.delete.error.ondeletehomework");
      console.error(error);
      return res.status(400).json({
        type: "homework.delete.error.ondeletehomework",
        error: error,
      });
    });
};
