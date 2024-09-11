const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const exerciseSchema = mongoose.Schema(
  {
    schema: { type: String },
    exerciseid: { type: String, required: true, unique: true },
    practicianid: { type: String, required: true },
    editionDate: { type: Date },
    name: { type: String, required: true },
    type: { type: String, required: true },
    data: { type: Object },
    token: { type: String }
  },
  { strict: true },
);

exerciseSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Exercise", exerciseSchema);
