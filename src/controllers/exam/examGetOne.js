require("dotenv").config();
const Exam = require("../../models/Exam.js");

module.exports = examGetOne = (req, res, next) => {
  /*
  
  sends back the exam value
  
  possible response types
  * exam.get.success
  * exam.get.error.notfound
  * exam.get.error.undefined
  
  */

  if (process.env.DEBUG) {
    console.log("exam.getone");
  }

  Exam.findOne({ examid: req.params.examid })
    .then((exam) => {
      if (exam !== undefined) {
        console.log("exam.get.success");
        return res.status(200).json({
          type: "exam.get.success",
          data: {
            exam: exam,
          },
        });
      } else {
        console.log("exam.get.error.undefined");
        return res.status(101).json({
          type: "exam.get.error.undefined",
          data: {
            exam: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("exam.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "exam.get.error.onfind",
        error: error,
        data: {
          exam: undefined,
        },
      });
    });
};
