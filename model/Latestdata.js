const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  email: { type: String, required: true },
});

const LatestData = model("LatestData", contactSchema);

module.exports = LatestData;
