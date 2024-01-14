const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const settingSchema = mongoose.Schema(
  {
    schema: { type: String },
    settingid: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    value: { required: true },
  },
  { strict: true },
);

settingSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Setting", settingSchema);
