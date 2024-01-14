const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const patientSchema = mongoose.Schema(
  {
    schema: { type: String },
    patientid: { type: String, required: true, unique: true },
    key: { type: String, required: true, unique: true },
    /*
    firstname: { type: String },
    lastname: { type: String },
    birthdata: { type: Date },
    email: { type: String },
    phone: { type: String },
    adresse: { 
    number: { type: String },
    street: { type: String },
    postalcode: { type: String },
    city: { type: String },
    */
  },
  { strict: true },
);

patientSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Patient", patientSchema);
