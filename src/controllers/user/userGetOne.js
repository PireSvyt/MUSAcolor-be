require("dotenv").config();
const jwt_decode = require("jwt-decode");
const User = require("../../models/User.js");
const Patient = require("../../models/Patient.js");

module.exports = userGetOne = (req, res, next) => {
  /*
  
  sends back the user value
  
  possible response types
  * user.get.success
  * user.get.error.notfound
  * user.get.error.undefined
  * user.get.error.onfind
  * user.get.error.onfindpatients
  
  */

  if (process.env.DEBUG) {
    console.log("user.getone");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  User.findOne({ userid: decodedToken.userid }, "userid type")
    .then((user) => {
      if (user !== undefined) {
        console.log("user.get.success");
        // practician (and admin)
        if (user.type === "practician" || user.type === "admin") {
          Patient.find({ practicianid: user.userid })
            .then((patients) => {
              let userToSend = {...user}
              if (patients === undefined) {
                userToSend.patients = []
              } else {
                userToSend.patients = patients
              }
              return res.status(200).json({
                type: "user.get.success",
                data: {
                  user: userToSend,
                },
              });
            })
            .catch((error) => {
              console.log("user.get.error.onfindpatients");
              console.error(error);
              let userToSend = {...user}
              userToSend.patients = []
              return res.status(400).json({
                type: "user.get.error.onfindpatients",
                error: error,
                data: {
                  user: userToSend,
                },
              });
            });
        }
        // patient
        if (user.usertype === "patient") {
          return res.status(200).json({
            type: "user.get.success",
            data: {
              user: user,
            },
          });
        }
        return res.status(200).json({
          type: "user.get.success",
          data: {
            user: user,
          },
        });
      } else {
        console.log("user.get.error.undefined");
        return res.status(101).json({
          type: "user.get.error.undefined",
          data: {
            user: undefined,
          },
        });
      }
    })
    .catch((error) => {
      console.log("user.get.error.onfind");
      console.error(error);
      return res.status(400).json({
        type: "user.get.error.onfind",
        error: error,
        data: {
          user: undefined,
        },
      });
    });
};
