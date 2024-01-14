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

  User.findOne({ 'auth.login': attemptLogin }, function(error, user){
        if(err){
            console.log("auth.signin.error.onfind");
            console.log(error);
            return res.status(500).json({
                type: "auth.signin.error.onfind",
                error: error,
            });
        }
        else{
            console.log(user);
            if (!user) {
                // Inexisting user
                console.log("auth.signin.error.notfound");
                return res.status(404).json({
                  type: "auth.signin.error.notfound",
                });
              } else {
                let attemptPassword = req.body.password;
                if (req.body.encryption === true) {
                  attemptPassword = CryptoJS.AES.decrypt(
                    attemptPassword,
                    process.env.ENCRYPTION_KEY,
                  ).toString(CryptoJS.enc.Utf8);
                }
                bcrypt
                  .compare(attemptPassword, user.auth.password)
                  .then((valid) => {
                    if (!valid) {
                      return res.status(401).json({
                        type: "auth.signin.error.invalidpassword",
                      });
                    } else {
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
                    console.log("auth.signin.error.onpasswordcompare");
                    console.log(error);
                    return res.status(500).json({
                      type: "auth.signin.error.onpasswordcompare",
                      error: error,
                    });
                  });
              }
        }
  })
};
