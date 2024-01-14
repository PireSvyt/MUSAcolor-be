require("dotenv").config();
const jwt_decode = require("jwt-decode");
const User = require("../../models/User.js");

module.exports = authAuthenticateAsPractician = (req, res, next) => {
  /*
  
  authenticate the user as a practician
  
  possible response types
  * auth.authenticateaspractician.error.isnotpractician
  * auth.authenticateaspractician.error.notfound
  * auth.authenticateaspractician.error.erroronfind
  
  */

  if (process.env.DEBUG) {
    console.log("auth.authenticateaspractician");
  }

  // Initialise
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt_decode(token);

  User.findOne({ userid: decodedToken.userid })
    .then((user) => {
      if (user !== undefined) {
        if (user.type === "practician" || user.type === "admin") {
          next();
        } else {
          return res.status(403).json({
            type: "auth.authenticateaspractician.error.isnotadmin",
          });
        }
      } else {
        return res.status(403).json({
          type: "auth.authenticateaspractician.error.notfound",
        });
      }
    })
    .catch((error) => {
      console.error(error);
      return res.status(403).json({
        type: "auth.authenticateaspractician.error.erroronfind",
        error: error,
      });
    });
};
