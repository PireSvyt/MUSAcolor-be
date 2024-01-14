const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const examSchema = mongoose.Schema(
  {
    schema: { type: String },
    examid: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    //time: { type: String, required: true },
    results: { required: true },
    //notes: { type: String, required: true },
  },
  { strict: true },
);

examSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Exam", examSchema);
