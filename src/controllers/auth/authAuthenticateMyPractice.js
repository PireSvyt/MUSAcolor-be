require("dotenv").config();
const jwt_decode = require("jwt-decode");
const User = require("../../models/User.js");

module.exports = authAuthenticateMyPractice = (req, res, next) => {
  /*
  
  authenticate the user as a practician
  
  possible response types
  * auth.authenticatemypractice.error.notallowed
  * auth.authenticatemypractice.error.notfound
  * auth.authenticatemypractice.error.erroronfind
  * auth.authenticatemypractice.error.missinginputs
  
  */

  if (process.env.DEBUG) {
    console.log("auth.authenticatemypractice");
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
        foreignField: "patientid",
        localField: "patientid",
        as: "patients",
        pipeline: [
          {
            $project: {
              _id: 0,
              patientid: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        patients: 1,
        type: 1,
      },
    },
  ])
  .then((users) => {
    if (users.length === 1) {
      let user = users[0];
      console.log("auth.authenticatemypractice", user)
      console.log("req.body.patientid", req.body.patientid)
      console.log("req.body.examid", req.body.examid)
      if (user.type === "admin") {
        next();
      } else if (user.type === "practician") {
        // Assess patient is one of my patients
        if (req.body.patientid !== undefined) {
            if (user.patients.includes(req.body.patientid)) {
                next()
            } else {
                return res.status(403).json({
                    type: "auth.authenticatemypractice.error.notallowed",
                    details: "not a related patient"
                });
            }
        } else {
            // Assess exam is related to one of my patients
            if (req.body.examid !== undefined) {
                Exam.findOne({ examid: req.body.examid })
                .then((exam) => {
                    if (exam !== undefined) {
                        if (user.patients.includes(exam.patientid)) {
                            next()
                        } else {
                            return res.status(403).json({
                                type: "auth.authenticatemypractice.error.notallowed",
                                details: "not a related exam"
                            });
                        }
                    } else {
                        return res.status(403).json({
                            type: "auth.authenticatemypractice.error.notfound",
                            details: "exam"
                        });
                    }
                })
                .catch((error) => {
                    console.error(error);
                    return res.status(500).json({
                      type: "auth.authenticatemypractice.error.erroronfind",
                      error: error,
                    });
                });
            } else {
                return res.status(403).json({
                    type: "auth.authenticatemypractice.error.missinginputs",
                });
            }
        }
      } else {
        return res.status(403).json({
          type: "auth.authenticatemypractice.error.notallowed",
        });
      }
    } else {
        return res.status(404).json({
          type: "auth.authenticatemypractice.error.notfound",
          details: "patient"
        });
    }
  })
  .catch((error) => {
    console.error(error);
    return res.status(500).json({
      type: "auth.authenticatemypractice.error.erroronfind",
      error: error,
    });
  });
};
