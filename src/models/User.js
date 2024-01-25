const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const userSchema = mongoose.Schema(
  {
    schema: { type: String },
    userid: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ["admin", "practician"]}, // patient in the future
    //patientid: { type: String }, // only for patients
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    signinattempts:  [{
      date : Date,
       }],
    passwordtoken: { type: String },
    //association: { type: String },
    //activation: { type: String },
  },
  { strict: true },
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
