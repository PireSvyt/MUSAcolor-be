require("dotenv").config();
const Exam = require("../../models/Exam.js");

module.exports = examSave = (req, res, next) => {
  /*
  
  saves a exam
  
  possible response types
  * exam.save.error.examid
  * exam.save.success.modified
  * exam.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("exam.save");
  }

  // Save
  if (req.body.examid === "" || req.body.examid === undefined) {
    console.log("exam.save.error.examid");
    return res.status(503).json({
      type: "exam.save.error.examid",
      error: error,
    });
  } else {
    // Modify
    let examToSave = { ...req.body };

    // Save
    Exam.updateOne({ examid: examToSave.examid }, examToSave)
      .then(() => {
        console.log("exam.save.success.modified");
        return res.status(200).json({
          type: "exam.save.success.modified",
        });
      })
      .catch((error) => {
        console.log("exam.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "exam.save.error.onmodify",
          error: error,
        });
      });
  }
};
