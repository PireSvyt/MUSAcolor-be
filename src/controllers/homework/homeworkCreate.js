require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Homework = require("../../models/Homework.js");

module.exports = homeworkCreate = (req, res, next) => {
  /*
  
  ...
  
  possible response types 
  * homework.create.success
  * homework.create.error.oncreate
  * homework.create.error.idprovided
  
  */

  if (process.env.DEBUG) {
    console.log("homework.create");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  // Save
  let homeworkToSave = { ...req.body };
  homeworkToSave.practicianid = decodedToken.userid
  homeworkToSave.editionDate = new Date()
  homeworkToSave = new Homework(homeworkToSave);
  console.log("homeworkToSave", homeworkToSave.toObject())

  // Save
  homeworkToSave
    .save()
    .then(() => {
      console.log("homework.create.success");
      return res.status(201).json({
        type: "homework.create.success",
        data: {
          homeworkid: homeworkToSave.homeworkid,
        },
      });
    })
    .catch((error) => {
      console.log("homework.create.error.oncreate");
      console.log(error);
      return res.status(400).json({
        type: "homework.create.error.oncreate",
        error: error,
        data: {
          homeworkid: null,
        },
      });
    });
};
