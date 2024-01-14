require("dotenv").config();
const User = require("../../models/User.js");

module.exports = userGetOne = (req, res, next) => {
  /*
  
  sends back the user value
  
  possible response types
  * user.get.success
  * user.get.error.notfound
  * user.get.error.undefined
  
  */

  if (process.env.DEBUG) {
    console.log("user.getone");
  }

  User.findOne({ userid: req.params.userid })
    .then((user) => {
      if (user !== undefined) {
        console.log("user.get.success");
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
