const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const prescriptionSchema = mongoose.Schema(
  {
    schema: { type: String },
    prescriptionid: { type: String, required: true, unique: true },
    practicianid: { type: String, required: true },
    editionDate: { type: Date },
    exercises: [{
        exerciseid: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        position: { type: Number },
        duration: { type: Number },
        data: { type: Object },
      }]
  },
  { strict: true },
);

prescriptionSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Prescription", prescriptionSchema);
