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

  Prescription.findOne({ prescriptionid: req.params.prescriptionid }, 'editionDate exercises')
    .then((prescription) => {
      if (prescription !== undefined) {
        console.log("prescription.get.success");
        return res.status(200).json({
          type: "prescription.get.success",
          data: {
            prescription: prescription,
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
