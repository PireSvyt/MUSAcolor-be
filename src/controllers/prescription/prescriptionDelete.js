require("dotenv").config();
const Prescription = require("../../models/Prescription.js");

module.exports = prescriptionDelete = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * prescription.delete.success
  * prescription.delete.error.ondeletegames
  * prescription.delete.error.ondeleteprescription
  
  */

  if (process.env.DEBUG) {
    console.log("prescription.delete");
  }

  Prescription.deleteOne({ prescriptionid: req.params.prescriptionid })
    .then((deleteOutcome) => {
      if (
        deleteOutcome.acknowledged === true &&
        deleteOutcome.deletedCount === 1
      ) {
        console.log("prescription.delete.success");
        return res.status(200).json({
          type: "prescription.delete.success",
          data: deleteOutcome,
        });
      } else {
        console.log("prescription.delete.error.outcome");
        return res.status(400).json({
          type: "prescription.delete.error.outcome",
          data: deleteOutcome,
        });
      }
    })
    .catch((error) => {
      console.log("prescription.delete.error.ondeleteprescription");
      console.error(error);
      return res.status(400).json({
        type: "prescription.delete.error.ondeleteprescription",
        error: error,
      });
    });
};
