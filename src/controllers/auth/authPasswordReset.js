require("dotenv").config();
const User = require("../../models/User.js");

module.exports = authPasswordReset = (req, res, next) => {
  /*
  
  reset password leveraging double authentication
  
  possible response types
  * auth.passwordreset.success
  * auth.passwordreset.error.inputs
  * auth.passwordreset.error.notfound
  
  */

  if (process.env.DEBUG) {
    console.log("auth.passwordreset");
  }

  // Save
  if ((req.body.token === "" || req.body.token === undefined) && 
      (req.body.login === "" || req.body.login === undefined)) {
    console.log("auth.passwordreset.error.inputs");
    return res.status(503).json({
      type: "auth.passwordreset.error.inputs",
    });
  } else {
    // Modify
    let settingToSave = { ...req.body };
    if (settingToSave.encryption === true) {
        settingToSave.login = CryptoJS.AES.decrypt(
            settingToSave.login,
            process.env.ENCRYPTION_KEY,
        ).toString(CryptoJS.enc.Utf8);
        settingToSave.password = CryptoJS.AES.decrypt(
            settingToSave.password,
            process.env.ENCRYPTION_KEY,
        ).toString(CryptoJS.enc.Utf8);
    }

    // Save
    User.findOne({ passwordtoken: settingToSave.token, login: settingToSave.login })
      .then((user) => {
        console.log("auth.passwordreset.found");
        user.password = settingToSave.password
        delete user.passwordtoken
        user.save()
          .then(() => {
            console.log("auth.passwordreset.success.modified");
            return res.status(200).json({
              type: "auth.passwordreset.success.modified",
              data: {
                userid: user.userid,
              },
            });
          })
          .catch((error) => {
            console.log("auth.passwordreset.error.onmodify");
            console.error(error);
            return res.status(400).json({
              type: "auth.passwordreset.error.onmodify",
              error: error,
            });
          });
      })
      .catch((error) => {
        console.log("auth.passwordreset.error.onmodify");
        console.error(error);
        return res.status(400).json({
          type: "auth.passwordreset.error.onmodify",
          error: error,
        });
      });
  }
};
