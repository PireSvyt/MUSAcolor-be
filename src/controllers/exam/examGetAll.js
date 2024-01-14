require("dotenv").config();
const Exam = require("../../models/Exam.js");

module.exports = examGetAll = (req, res, next) => {
  /*
  
  sends back all the exams
  
  possible response types
  * exams.get.success
  
  */

  if (process.env.DEBUG) {
    console.log("exams.get");
  }

  Exam.find({})
    .then((exams) => {
      if (exams !== undefined) {
        console.log("exam.get.success");
        return res.status(200).json({
          type: "exams.get.success",
          data: {
            exams: exams,
          },
        });
      } else {
        console.log("exam.get.error.notfound");
        return res.status(101).json({
          type: "exams.get.error.notfound",
          data: {
            exams: [],
          },
        });
      }
    })
    .catch((error) => {
      console.log("exams.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "exams.get.error.onfind",
        error: error,
        data: {
          exams: [],
        },
      });
    });
};
