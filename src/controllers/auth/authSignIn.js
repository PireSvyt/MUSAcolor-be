require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// BCRYPT https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/
const CryptoJS = require("crypto-js");

const User = require("../../models/User.js");

module.exports = authSignIn = (req, res, next) => {
  /*
  
  sign in a user
  sends back a jwt token
  
  IMPORTANT NOTE : 
    PASSWORD IS ENCRYPTED IN FRONTEND 
    AND DECRYPTED FOR BCRYPT COMPARE HERE
  
  possible response types
  * auth.signin.success
  * auth.signin.error.notfound
  * auth.signin.error.onfind
  * auth.signin.error.invalidpassword
  * auth.signin.error.onpasswordcompare
  * auth.signin.error.statussignedup
  * auth.signin.error.statusunknown
  * auth.signin.error.toomanyattempts
  
  */

  if (process.env.DEBUG) {
    console.log("auth.signin");
  }

  let attemptLogin = req.body.login;
  // Login decrypt
  if (req.body.encryption === true) {
    attemptLogin = CryptoJS.AES.decrypt(
      attemptLogin,
      process.env.ENCRYPTION_KEY,
    ).toString(CryptoJS.enc.Utf8);
  }

  User.findOne({ login: attemptLogin })
    .then((user) => {
      if (!user) {
        // Inexisting user
        console.log("auth.signin.error.notfound");
        return res.status(404).json({
          type: "auth.signin.error.notfound",
        });
      } else {
        // Chech attempts
        if (user.signinattempts === undefined) {
          user.signinattempts = []
        }
        let attemptStatus = attemptsMeetThreshold(user.signinattempts)
        if (attemptStatus.meetsThreshold) {
          // Check password
          let attemptPassword = req.body.password;
          if (req.body.encryption === true) {
            attemptPassword = CryptoJS.AES.decrypt(
              attemptPassword,
              process.env.ENCRYPTION_KEY,
            ).toString(CryptoJS.enc.Utf8);
          }
          bcrypt
            .compare(attemptPassword, user.password)
            .then((valid) => {
              if (!valid) {
                // Account for attempt
                user.signinattempts.push({
                  date: Date.now()
                })
                user.save()
                .then(() => {
                  console.log("auth.signin.error.invalidpassword attempt accounted");
                  return res.status(401).json({
                    type: "auth.signin.error.invalidpassword",
                  });
                })
                .catch((error) => {
                  console.log("auth.signin.error.onaccountforattempt");
                  console.log(error);
                  return res.status(400).json({
                    type: "auth.signin.error.onaccountforattempt",
                    error: error,
                  });
                });
              } else {
                // Grant access
                return res.status(200).json({
                  type: "auth.signin.success",
                  data: {
                    token: jwt.sign(
                      {
                        userid: user.userid,
                        type: user.type,
                      },
                      process.env.JWT_SECRET,
                      {
                        expiresIn: "72h",
                      },
                    ),
                  },
                });
              }
            })
            .catch((error) => {
              console.log("auth.signin.error.onpasswordcompare", error);
              return res.status(500).json({
                type: "auth.signin.error.onpasswordcompare",
                error: error,
              });
            });
        } else {
          // Deny attempt
          return res.status(404).json({
            type: "auth.signin.error.abovethreshold",
            data: {
              thresholddate: attemptStatus.thresholdDate
            }
          });
        }
      }
    })
    .catch((error) => {
      console.log("auth.signin.error.onfind", error);
      return res.status(500).json({
        type: "auth.signin.error.onfind",
        error: error,
      });
    });
};

function attemptsMeetThreshold (attempts) {
  let meetsThreshold = true
  let thresholdDate = Date.now()

  // Filter attempts
  let threshold = {
    attempts: 5, // attempts per 
    duration: 1 // minutes
  }
  var diffMinutes = Date.setMinutes(threshold.duration, 0, 0)
  let thresholdedAttempts = attempts.filter(attempt => attempt.date > Date.now() - diffMinutes)
  
  // Check threshold
  if (thresholdedAttempts.length >= threshold.attempts) {
    meetsThreshold = false
    thresholdDate = Date.now() + diffMinutes
  }
  return {
    meetsThreshold: meetsThreshold,
    thresholdDate: thresholdDate
  }
}