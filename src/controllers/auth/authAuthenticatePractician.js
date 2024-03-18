require("dotenv").config();
const User = require("../../models/User.js");

module.exports = authAuthenticatePractician = (req, res, next) => {
  /*
  
  authenticate the user as a practician
  
  possible response types
  * auth.authenticatepractician.error.isnotpractician
  * auth.authenticatepractician.error.notfound
  * auth.authenticatepractician.error.erroronfind
  
  */

  if (process.env.DEBUG) {
    console.log("auth.authenticatepractician");
  }

  User.aggregate([
    {
      $match: { userid: req.augmented.user.userid },
    },
    {
      $lookup: {
        from: "patients",
        foreignField: "practicianid",
        localField: "userid",
        as: "patients",
      },
    },
  ])
  .then((users) => {
    if (users.length === 1) {
        let user = users[0];
        if (user.type === "practician" || user.type === "admin") {
          req.augmented.user.type = user.type;
          req.augmented.user.patients = user.patients
          next();
        } else {
          return res.status(403).json({
            type: "auth.authenticatepractician.error.isnotadmin",
          });
        }
    } else {
        return res.status(403).json({
          type: "auth.authenticatepractician.error.notfound",
        });
    }
  })
    .catch((error) => {
      console.error(error);
      return res.status(403).json({
        type: "auth.authenticatepractician.error.erroronfind",
        error: error,
      });
    });
};
