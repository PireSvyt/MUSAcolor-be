require("dotenv").config();
const jwt_decode = require("jwt-decode");
const User = require("../../models/User.js");
const Patient = require("../../models/Patient.js");

module.exports = userGetOne = (req, res, next) => {
  /*
  
  sends back the user value
  
  possible response types
  * user.get.success
  * user.get.error.onfinduser
  * user.get.error.onaggregate
  
  */

  if (process.env.DEBUG) {
    console.log("user.getone");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  User.aggregate([
    {
      $match: { userid: decodedToken.userid },
    },
    {
      $lookup: {
        from: "patients",
        foreignField: "practicianid",
        localField: "userid",
        as: "patients",
        pipeline: [
          {
            $project: {
              _id: 0,
              schema: 0,
              patientid: 1,
              practicianid: 0,
              key: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        schema: 0,
        userid: 1,
        type: 1,
        login: 0,
        password: 0,
        passwordtoken: 0
      },
    },
  ])
    .then((users) => {
      if (users.length === 1) {
        let userToSend = users[0];
        return res.status(200).json({
          type: "user.get.success",
          data: {
            user: userToSend,
          },
        });
      } else {
        console.log("user.get.error.onfinduser");
        return res.status(400).json({
          type: "user.get.error.onfinduser",
        });
      }
    })
    .catch((error) => {
      console.log("user.get.error.onaggregate");
      console.error(error);
      res.status(400).json({
        type: "user.get.error.onaggregate",
        error: error,
      });
    });
};
