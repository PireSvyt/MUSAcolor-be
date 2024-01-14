require("dotenv").config();
const Exam = require("../../models/Exam.js");

module.exports = examCreate = (req, res, next) => {
  /*
  
  ...
  
  possible response types
  * exam.create.success
  * exam.create.error.oncreate
  * exam.create.error.idprovided
  
  */

  if (process.env.DEBUG) {
    console.log("exam.create");
  }

  // Save
  let examToSave = { ...req.body };
  examToSave = new Exam(examToSave);

  // Save
  examToSave
    .save()
    .then(() => {
      console.log("exam.create.success");
      return res.status(201).json({
        type: "exam.create.success",
        data: {
          examid: examToSave.examid,
        },
      });
    })
    .catch((error) => {
      console.log("exam.create.error.oncreate");
      console.log(error);
      return res.status(400).json({
        type: "exam.create.error.oncreate",
        error: error,
        data: {
          examid: null,
        },
      });
    });
};
