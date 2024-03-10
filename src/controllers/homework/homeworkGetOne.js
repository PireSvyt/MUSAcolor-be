require("dotenv").config();
const Homework = require("../../models/Homework.js");

module.exports = homeworkGetOne = (req, res, next) => {
  /*
  
  sends back the homework value
  
  possible response types
  * homework.get.success
  * homework.get.error.notfound
  * homework.get.error.undefined
  
  */

  if (process.env.DEBUG) {
    console.log("homework.getone");
  }

  Homework.findOne({ homeworkid: req.params.homeworkid })
    .then((homework) => {
      if (homework !== undefined) {
        console.log("homework.get.success");
        return res.status(200).json({
          type: "homework.get.success",
          data: {
            homework: homework,
          },
        });
      } else {
        console.log("homework.get.error.undefined");
        return res.status(101).json({
          type: "homework.get.error.undefined",
          data: {
            homework: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("homework.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "homework.get.error.onfind",
        error: error,
        data: {
          homework: undefined,
        },
      });
    });
};
