require("dotenv").config();
const jwt_decode = require("jwt-decode");
const Homework = require("../../models/Homework.js");

module.exports = homeworkSave = (req, res, next) => {
  /*
  
  saves a homework
  
  possible response types
  * homework.save.error.homeworkid
  * homework.save.success.modified
  * homework.save.error.onmodify
  
  */

  if (process.env.DEBUG) {
    console.log("homework.save");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  // Save
  if (req.body.homeworkid === "" || req.body.homeworkid === undefined) {
    console.log("homework.save.error.homeworkid");
    return res.status(503).json({
      type: "homework.save.error.homeworkid",
      error: error,
    });
  } else {
    // Modify
    let homeworkToSave = { ...req.body };
    homeworkToSave.practicianid = decodedToken.userid
    homeworkToSave.editionDate = new Date()
    homeworkToSave = new Homework(homeworkToSave);
    console.log("homeworkToSave", homeworkToSave.toObject())

    // Save
    Homework.updateOne({ 
      homeworkid: homeworkToSave.homeworkid,
      practicianid: decodedToken.userid
    }, homeworkToSave)
      .then(() => {
        console.log("homework.save.success.modified");
        return res.status(200).json({
          type: "homework.save.success.modified",
        });
      })
      .catch((error) => {
        console.log("homework.save.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "homework.save.error.onmodify",
          error: error,
        });
      });
  }
};
